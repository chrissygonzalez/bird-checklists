import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { EbirdRegion, Observation } from '../types';
import RegionSelect from './RegionSelect';
import StateSelect from "./StateSelect";
import ObservationsByDate from "./ObservationsByDate";
import ObservationsByBird from "./ObservationsByBird";
import ObservationsByLocation from "./ObservationsByLocation";
import ViewNav from "./ViewNav";

const StatePicker = ({ states, setSelectedState }: { states: EbirdRegion[], setSelectedState: React.Dispatch<React.SetStateAction<string>> }) => {
    return (
        <>
            <h2>Choose a state</h2>
            <div className="picker-container">
                {states?.map((state: EbirdRegion) => <button className="picker" key={state.code} onClick={() => setSelectedState(state.code)}>{state.name}</button>)}
            </div>
        </>)
}

const RegionPicker = ({ selectedState, regions, setSelectedRegion }: { selectedState: string, regions: EbirdRegion[], setSelectedRegion: React.Dispatch<React.SetStateAction<string>> }) => {
    return (
        <>
            <h2>Choose a region in {selectedState}</h2>
            <div className="picker-container">
                {regions?.map((region: EbirdRegion) => <button className="picker" key={region.code} onClick={() => setSelectedRegion(region.code)}>{region.name}</button>)}
            </div>
        </>)
}

const RegionalObservations = () => {
    const [selectedState, setSelectedState] = useState(localStorage.getItem('selectedState') || '');
    const [selectedStateName, setSelectedStateName] = useState(localStorage.getItem('selectedStateName') || '');
    const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem('selectedRegion') || '');
    const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");
    const [regions, setRegions] = useState<EbirdRegion[]>([]);
    const [obs, setObs] = useState<Observation[]>([]);
    const [viewType, setViewType] = useState('date');
    const [locationMap, setLocationMap] = useState(new Map());
    const [speciesMap, setSpeciesMap] = useState(new Map());

    useEffect(() => {
        localStorage.setItem('selectedState', selectedState);
        localStorage.setItem('selectedStateName', selectedStateName);
        if (selectedState !== '') {
            setRegions([]);
            setObs([]);
            fetchRegions(selectedState);
            sessionStorage.setItem('selectedRegion', '');
            setSelectedStateName(states?.find((state: EbirdRegion) => state.code === selectedState).name || '');
            setViewType('date');
        } else {
            setRegions([]);
            setObs([]);
            setSelectedState('');
            setSelectedStateName('');
            setSelectedRegion('');
            setViewType('date');
        }
    }, [selectedState]);

    useEffect(() => {
        localStorage.setItem('selectedRegion', selectedRegion);
        if (regions.map(r => r.code).includes(selectedRegion)) {
            fetchObs();
        } else {
            setObs([]);
            setSelectedRegion('');
            setViewType('date');
        }
    }, [selectedRegion]);

    let myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", `${import.meta.env.VITE_EBIRD_KEY}`);
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const fetchRegions = (region: string) => {
        fetch(`https://api.ebird.org/v2/ref/region/list/subnational2/${region}`, requestOptions)
            .then(res => res.json())
            .then(data => setRegions(data));
    }

    const fetchObs = () => {
        fetch(`https://api.ebird.org/v2/data/obs/${selectedRegion}/recent?back=30`, requestOptions)
            .then(res => res.json())
            .then(data => {
                setObs(data);
                makeLocationMap(data);
                makeSpeciesMap(data);
            });
    }

    const makeLocationMap = (data: Observation[]) => {
        const lMap = new Map();
        for (const location of data) {
            if (!lMap.has(location.locId)) {
                lMap.set(location.locId, location.locName);
            }
        }
        setLocationMap(lMap);
    }

    const makeSpeciesMap = (data: Observation[]) => {
        const sMap = new Map();
        for (const species of data) {
            if (!sMap.has(species.speciesCode)) {
                sMap.set(species.speciesCode, species.comName);
            }
        }
        setSpeciesMap(sMap);
    }

    return (
        <div className="content">
            <header>
                <h1 className='langar-regular header-text' onClick={() => setViewType('date')}>Birds in Your Neighborhood</h1>
                <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            </header>

            {obs?.length === 0 && <div className="picker-view">
                {states?.length > 0 && regions?.length === 0 && <StatePicker states={states} setSelectedState={setSelectedState} />}
                {regions?.length > 0 && obs?.length === 0 && <RegionPicker selectedState={selectedStateName} regions={regions} setSelectedRegion={setSelectedRegion} />}
            </div>}

            {obs?.length > 0 && <ViewNav viewType={viewType} setViewType={setViewType} startDate={obs[obs.length - 1].obsDt} endDate={obs[0].obsDt} />}
            {viewType === 'date' && <ObservationsByDate birds={obs} />}
            {viewType === 'bird' && <ObservationsByBird birds={obs} speciesMap={speciesMap} locationMap={locationMap} />}
            {viewType === 'location' && <ObservationsByLocation birds={obs} locationMap={locationMap} />}
        </div>
    )
}

export default RegionalObservations;