import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { Observation } from '../types';
import RegionSelect from './RegionSelect';
import Observations from "./Observations";
import StateSelect from "./StateSelect";

const RegionalObservations = () => {
    const [selectedState, setSelectedState] = useState(localStorage.getItem('selectedState') || '');
    const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem('selectedRegion') || '');
    const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");
    const [regions, setRegions] = useState([]);
    const [obs, setObs] = useState([]);

    useEffect(() => {
        localStorage.setItem('selectedState', selectedState);
        if (selectedState !== '') {
            fetchRegions(selectedState);
        } else {
            setSelectedRegion('');
            sessionStorage.setItem('selectedRegion', '');
        }
        setObs([]);
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
        fetch(`https://api.ebird.org/v2/data/obs/${selectedRegion}/recent`, requestOptions)
            .then(res => res.json())
            .then(data => {
                setObs(data);
                sortByBird();
                console.log(data);
            });
    }

    const sortByBird = () => {
        let byBird = [...obs].sort((a: Observation, b: Observation) => a.comName > b.comName ? 1 : -1);
        setObs(byBird);
    }

    const sortByDate = () => {
        let byDate = [...obs].sort((a: Observation, b: Observation) => a.obsDt > b.obsDt ? 1 : -1);
        setObs(byDate);
    }

    const sortByLocation = () => {
        let byLocation = [...obs].sort((a: Observation, b: Observation) => a.locName > b.locName ? 1 : -1);
        setObs(byLocation);
    }

    return (
        <div className="inputs">
            <div>
                <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            </div>
            <button onClick={sortByBird}>Sort by bird name</button>
            <button onClick={sortByDate}>Sort by date</button>
            <button onClick={sortByLocation}>Sort by location</button>
            <Observations obs={obs} />
        </div>
    )
}

export default RegionalObservations;