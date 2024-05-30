import { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EbirdRegion, Observation } from '../types';
import ObservationsByDate from "./ObservationsByDate";
import ObservationsByBird from "./ObservationsByBird";
import ObservationsByLocation from "./ObservationsByLocation";
import { getLocationMap, getSpeciesMap } from "../helpers";
import { BirdContext, BirdContextType } from "./BirdContext";
import MainHeader from "./MainHeader";
import Picker from "./Picker";

const RegionalObservations = () => {
    const {
        states,
        statesLoading,
        error,
        selectedState,
        setSelectedState,
        selectedStateName,
        setSelectedStateName,
        setRegions,
        selectedRegion,
        setSelectedRegion,
        viewType,
        setViewType } = useContext(BirdContext) as BirdContextType;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [obs, setObs] = useState<Observation[]>([]);
    const [locationMap, setLocationMap] = useState(new Map());
    const [speciesMap, setSpeciesMap] = useState(new Map());

    useEffect(() => {
        localStorage.setItem('selectedState', selectedState);
        if (selectedState !== '') {
            setRegions([]);
            setObs([]);
            fetchRegions(selectedState);
            setSelectedStateName(states?.find((state: EbirdRegion) => state.code === selectedState)?.name || '');
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
                if (data.errors) {
                    setIsLoading(false);
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
            {(errorMessage || error) &&
                <div className="error-container">
                    <div className="error">Sorry, we're having trouble connecting to EBird right now.<br></br>Please try again later.</div>
                </div>}
            <MainHeader obs={obs} />
            <ErrorBoundary fallback={<div>{errorMessage}</div>}>
                {(isLoading || statesLoading) ?
                    <div className="loader-container"><div className="loader"></div></div> :
                    <>
                        {obs?.length === 0 && <Picker />}
                        {!!obs?.length && viewType === 'date' && <ObservationsByDate birds={obs} />}
                        {viewType === 'bird' && <ObservationsByBird birds={obs} speciesMap={speciesMap} locationMap={locationMap} />}
                        {viewType === 'location' && <ObservationsByLocation birds={obs} locationMap={locationMap} />}
                    </>}
            </ErrorBoundary>
        </div>
    )
}

export default RegionalObservations;