import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { EbirdRegion, Observation } from '../types';
import RegionSelect from './RegionSelect';
import StateSelect from "./StateSelect";
import ObservationsByDate from "./ObservationsByDate";
import ObservationsByBird from "./ObservationsByBird";
import ObservationsByLocation from "./ObservationsByLocation";
import ViewNav from "./ViewNav";
import { getLocationMap, getSpeciesMap } from "../helpers";

const StatePicker = ({ states, setSelectedState }: { states: EbirdRegion[], setSelectedState: React.Dispatch<React.SetStateAction<string>> }) => {
    return (
        <>
            <h2 className="picker-page-title">Explore recent bird observations</h2>
            <h3 className="picker-title">Choose a state to get started:</h3>
            <div className="picker-container">
                {states?.map((state: EbirdRegion) => <button className="picker" key={state.code} onClick={() => setSelectedState(state.code)}>{state.name}</button>)}
            </div>
        </>)
}

const RegionPicker = ({ selectedState, regions, setSelectedRegion }: { selectedState: string, regions: EbirdRegion[], setSelectedRegion: React.Dispatch<React.SetStateAction<string>> }) => {
    return (
        <>
            <h2 className="picker-page-title">Explore recent bird observations</h2>
            <h3 className="picker-title">Choose a region in {selectedState}:</h3>
            <div className="picker-container">
                {regions?.map((region: EbirdRegion) => <button className="picker" key={region.code} onClick={() => setSelectedRegion(region.code)}>{region.name}</button>)}
            </div>
        </>)
}

const RegionalObservations = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedState, setSelectedState] = useState(localStorage.getItem('selectedState') || '');
    const [selectedStateName, setSelectedStateName] = useState(localStorage.getItem('selectedStateName') || '');
    const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem('selectedRegion') || '');
    const { data: states } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");
    const [regions, setRegions] = useState<EbirdRegion[]>([]);
    const [obs, setObs] = useState<Observation[]>([]);
    const [viewType, setViewType] = useState('date');
    const [locationMap, setLocationMap] = useState(new Map());
    const [speciesMap, setSpeciesMap] = useState(new Map());

    useEffect(() => {
        localStorage.setItem('selectedState', selectedState);
        if (selectedState !== '') {
            setRegions([]);
            setObs([]);
            fetchRegions(selectedState);
            setSelectedStateName(states?.find((state: EbirdRegion) => state.code === selectedState).name || '');
            localStorage.setItem('selectedStateName', selectedStateName);
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
        setObs([]);
        if (selectedRegion !== '') {
            fetchObs();
        }
        setViewType('date');
    }, [selectedRegion]);

    let myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", `${import.meta.env.VITE_EBIRD_KEY}`);
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const fetchRegions = (region: string) => {
        setIsLoading(true);
        fetch(`https://api.ebird.org/v2/ref/region/list/subnational2/${region}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                setRegions(data);
                setIsLoading(false);
            });
    }

    const fetchObs = () => {
        setIsLoading(true);
        fetch(`https://api.ebird.org/v2/data/obs/${selectedRegion}/recent?back=30`, requestOptions)
            .then(res => res.json())
            .then((data: Observation[]) => {
                setObs(data);
                setLocationMap(getLocationMap(data));
                setSpeciesMap(getSpeciesMap(data));
                setIsLoading(false);
            });
    }

    return (
        <div className="content">
            {isLoading && <div className="container"><h1 className="loading">Is Loading!!!</h1></div>}
            <header>
                <div className="header-flex">
                    <h1 className='langar-regular header-text' onClick={() => setViewType('date')}>Birds in the Neighborhood</h1>
                    <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                    <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
                </div>
                {obs?.length > 0 && <ViewNav viewType={viewType} setViewType={setViewType} startDate={obs[obs.length - 1].obsDt} endDate={obs[0].obsDt} />}
            </header>

            {obs?.length === 0 && !isLoading && <div className="picker-view">
                {states?.length > 0 && regions?.length === 0 && <StatePicker states={states} setSelectedState={setSelectedState} />}
                {regions?.length > 0 && obs?.length === 0 && <RegionPicker selectedState={selectedStateName} regions={regions} setSelectedRegion={setSelectedRegion} />}
            </div>}

            {obs?.length && viewType === 'date' && <ObservationsByDate birds={obs} />}
            {viewType === 'bird' && <ObservationsByBird birds={obs} speciesMap={speciesMap} locationMap={locationMap} />}
            {viewType === 'location' && <ObservationsByLocation birds={obs} locationMap={locationMap} />}
        </div>
    )
}

export default RegionalObservations;