import { useEffect, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ViewTypes } from '../types';
import ObservationsByDate from "./ObservationsByDate";
import ObservationsByBird from "./ObservationsByBird";
import ObservationsByLocation from "./ObservationsByLocation";
import { BirdContext, BirdContextType, BirdDispatchContext, BirdActionEnum } from "./BirdContext";
import MainHeader from "./MainHeader";
import Picker from "./Picker";

const RegionalObservations = () => {
    const dispatch = useContext(BirdDispatchContext);
    const {
        viewType,
        hasObs,
        isLoading,
        error,
        selectedState,
        selectedStateName,
        selectedRegion,
    } = useContext(BirdContext) as BirdContextType;

    useEffect(() => {
        if (selectedState !== '') {
            dispatch({ type: BirdActionEnum.INITIALIZE_REGIONS, payload: [] });
            fetchRegions(selectedState);
        } else {
            dispatch({ type: BirdActionEnum.CLEAR_STATE });
        }
    }, [selectedState, selectedStateName]);

    useEffect(() => {
        if (selectedRegion !== '') {
            fetchObs();
        }
    }, [selectedRegion]);

    const myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", `${import.meta.env.VITE_EBIRD_KEY}`);
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const fetchRegions = (region: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`https://api.ebird.org/v2/ref/region/list/subnational2/${region}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.errors) {
                    dispatch({ type: BirdActionEnum.SET_ERROR });
                    throw Error('could not fetch the data for that resource');
                } else {
                    dispatch({ type: BirdActionEnum.INITIALIZE_REGIONS, payload: data })
                }
            }).catch(err => console.error(err.message));
    }

    const fetchObs = () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`https://api.ebird.org/v2/data/obs/${selectedRegion}/recent?back=30`, requestOptions)
            .then(res => res.json())
            .then((data) => {
                if (data.errors) {
                    dispatch({ type: BirdActionEnum.SET_ERROR });
                    throw Error('could not fetch the data for that resource');
                } else {
                    dispatch({ type: BirdActionEnum.SET_OBSERVATIONS, payload: data });
                }
            }).catch(err => console.error(err.message));
    }

    return (
        <>
            <MainHeader />
            <div className="content">
                {(error) &&
                    <div className="error-container">
                        <div className="error">
                            Sorry, we're having trouble connecting to EBird right now.<br></br>Please try again later.
                        </div>
                    </div>}
                <ErrorBoundary fallback={<div>{error}</div>}>
                    {isLoading ?
                        <div className="loader-container"><div className="loader"></div></div> :
                        <>
                            {!hasObs && <Picker />}
                            {hasObs && viewType === ViewTypes.DATE && <ObservationsByDate />}
                            {hasObs && viewType === ViewTypes.BIRD && <ObservationsByBird />}
                            {hasObs && viewType === ViewTypes.LOCATION && <ObservationsByLocation />}
                        </>}
                </ErrorBoundary>
            </div>
        </>
    )
}

export default RegionalObservations;