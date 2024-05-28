import { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useFetch from "../hooks/useFetch";
import { EbirdRegion, Observation } from '../types';
import RegionSelect from './RegionSelect';
import StateSelect from "./StateSelect";
import ObservationsByDate from "./ObservationsByDate";
import ObservationsByBird from "./ObservationsByBird";
import ObservationsByLocation from "./ObservationsByLocation";
import ViewNav from "./ViewNav";
import { getLocationMap, getSpeciesMap } from "../helpers";
import { BirdContext, BirdContextType } from "./BirdContext";

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
    const { viewType, setViewType } = useContext(BirdContext) as BirdContextType;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedState, setSelectedState] = useState(localStorage.getItem('selectedState') || '');
    const [selectedStateName, setSelectedStateName] = useState(localStorage.getItem('selectedStateName') || '');
    const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem('selectedRegion') || '');
    // const { data: states, isLoading: statesLoading, error } = useFetch("https://api.ebird.org/v2/ref/reg/list/subnational8/US");
    const { data: states, isLoading: statesLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");
    const [regions, setRegions] = useState<EbirdRegion[]>([]);
    const [obs, setObs] = useState<Observation[]>([]);
    // const [viewType, setViewType] = useState('date');
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
                // debugger;
                if (data.errors) {
                    setIsLoading(false);
                    console.log(data.errors);
                    setErrorMessage('could not fetch the data for that resource');
                    throw Error('could not fetch the data for that resource');
                } else {
                    setRegions(data);
                    setErrorMessage('');
                    setIsLoading(false);
                }
            }).catch(err => console.error(err.message));
    }

    const fetchObs = () => {
        setIsLoading(true);
        fetch(`https://api.ebird.org/v2/data/obs/${selectedRegion}/recent?back=30`, requestOptions)
            .then(res => res.json())
            .then((data) => {
                if (data.errors) {
                    setIsLoading(false);
                    console.log(data.errors);
                    setErrorMessage('could not fetch the data for that resource');
                    throw Error('could not fetch the data for that resource');
                } else {
                    setObs(data);
                    setErrorMessage('');
                    setLocationMap(getLocationMap(data));
                    setSpeciesMap(getSpeciesMap(data));
                    setIsLoading(false);
                }
            }).catch(err => console.error(err.message));
    }

    return (
        <div className="content">
            {(errorMessage || error) && <div className="error-container"><div className="error">Sorry, we're having trouble connecting to EBird right now.<br></br>Please try again later.</div></div>}
            <header>
                <div className="header-flex">
                    <h1 className='langar-regular header-text' onClick={() => setViewType('date')}>Birds in the Neighborhood</h1>
                    <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                    <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
                </div>
                {obs?.length > 0 && <ViewNav viewType={viewType} setViewType={setViewType} startDate={obs[obs.length - 1].obsDt} endDate={obs[0].obsDt} />}
            </header>
            <ErrorBoundary fallback={<div>{errorMessage}</div>}>
                {(isLoading || statesLoading) ? <div className="loader-container"><div className="loader"></div></div> :
                    <>{obs?.length === 0 && <div className="picker-view">
                        {states?.length > 0 && regions?.length === 0 && <StatePicker states={states} setSelectedState={setSelectedState} />}
                        {regions?.length > 0 && obs?.length === 0 && <RegionPicker selectedState={selectedStateName} regions={regions} setSelectedRegion={setSelectedRegion} />}
                    </div>}
                        {!!obs?.length && viewType === 'date' && <ObservationsByDate birds={obs} />}
                        {viewType === 'bird' && <ObservationsByBird birds={obs} speciesMap={speciesMap} locationMap={locationMap} />}
                        {viewType === 'location' && <ObservationsByLocation birds={obs} locationMap={locationMap} />}
                    </>}
            </ErrorBoundary>
        </div>
    )
}

export default RegionalObservations;