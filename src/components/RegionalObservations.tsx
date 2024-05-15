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
    return (<div>
        {states?.map((state: EbirdRegion) => <button key={state.code} onClick={() => setSelectedState(state.code)}>{state.name}</button>)}
    </div>)
}

const RegionPicker = ({ regions, setSelectedRegion }: { regions: EbirdRegion[], setSelectedRegion: React.Dispatch<React.SetStateAction<string>> }) => {
    return (<div>
        {regions?.map((region: EbirdRegion) => <button key={region.code} onClick={() => setSelectedRegion(region.code)}>{region.name}</button>)}
    </div>)
}

const RegionalObservations = () => {
    const [selectedState, setSelectedState] = useState(localStorage.getItem('selectedState') || '');
    const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem('selectedRegion') || '');
    const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");
    const [regions, setRegions] = useState([]);
    const [obs, setObs] = useState<Observation[]>([]);
    const [viewType, setViewType] = useState('date');
    const [locationMap, setLocationMap] = useState(new Map());
    const [speciesMap, setSpeciesMap] = useState(new Map());

    // TODO: fix this logic
    useEffect(() => {
        localStorage.setItem('selectedState', selectedState);
        if (selectedState !== '') {
            fetchRegions(selectedState);
            setRegions([]);
            sessionStorage.setItem('selectedRegion', '');
            setViewType('date');
        } else {
            setSelectedRegion('');
        }
    }, [selectedState]);

    useEffect(() => {
        localStorage.setItem('selectedRegion', selectedRegion);
        if (selectedRegion) {
            fetchObs();
        } else {
            setObs([]);
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
        <div>
            <header>
                <h1 className='langar-regular header-text' onClick={() => setViewType('date')}>Birds in Your Neighborhood</h1>
                <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            </header>

            {states?.length > 0 && regions?.length === 0 && <StatePicker states={states} setSelectedState={setSelectedState} />}
            {states?.length > 0 && regions?.length > 0 && obs?.length === 0 && <RegionPicker regions={regions} setSelectedRegion={setSelectedRegion} />}

            {obs?.length > 0 && <ViewNav viewType={viewType} setViewType={setViewType} startDate={obs[obs.length - 1].obsDt} endDate={obs[0].obsDt} />}
            {viewType === 'date' && <ObservationsByDate birds={obs} />}
            {viewType === 'bird' && <ObservationsByBird birds={obs} speciesMap={speciesMap} locationMap={locationMap} />}
            {viewType === 'location' && <ObservationsByLocation birds={obs} locationMap={locationMap} />}
        </div>
    )
}

export default RegionalObservations;