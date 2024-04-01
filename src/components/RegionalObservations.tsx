import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { Observation } from '../types';
import RegionSelect from './RegionSelect';
import Observations from "./Observations";
import StateSelect from "./StateSelect";
import ObservationsByDate from "./ObservationsByDate";

const RegionalObservations = () => {
    const [selectedState, setSelectedState] = useState(localStorage.getItem('selectedState') || '');
    const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem('selectedRegion') || '');
    const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");
    const [regions, setRegions] = useState([]);
    const [obs, setObs] = useState<Observation[]>([]);
    const [dateMap, setDateMap] = useState(new Map());

    useEffect(() => {
        localStorage.setItem('selectedState', selectedState);
        if (selectedState !== '') {
            fetchRegions(selectedState);
        } else {
            setSelectedRegion('');
            setRegions([]);
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
                console.log(data);
            });
    }

    const sortByBird = () => {
        let byBird = [...obs].sort((a: Observation, b: Observation) => a.comName > b.comName ? 1 : -1);
        setObs(byBird);
    }

    const sortByDate = () => {
        let byDate = [...obs].sort((a: Observation, b: Observation) => {
            if (a.obsDt < b.obsDt) {
                return 1;
            } else if (a.obsDt === b.obsDt) {
                return 0;
            } else {
                return -1;
            }
        });
        setObs(byDate);
        const dateMap: Map<string, Observation[]> = new Map();
        for (const ob of obs) {
            const date = ob.obsDt;
            if (dateMap.has(date)) {
                const arr = dateMap.get(date);
                arr?.push(ob);
            } else {
                dateMap.set(date, [ob]);
            }
        }
        setDateMap(dateMap);
        console.log(dateMap);
    }

    const sortByLocation = () => {
        let byLocation = [...obs].sort((a: Observation, b: Observation) => a.locName > b.locName ? 1 : -1);
        setObs(byLocation);

        const locMap = new Map();
        for (const ob of obs) {
            const loc = ob.locName;
            if (locMap.has(loc)) {
                const arr = locMap.get(loc);
                arr.push(ob);
            } else {
                locMap.set(loc, [ob]);
            }
        }
        console.log(locMap);
    }

    return (
        <div className="inputs">
            <div>
                <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            </div>
            <button onClick={sortByDate}>Sort by date</button>
            <button onClick={sortByBird}>Sort by bird name</button>
            <button onClick={sortByLocation}>Sort by location</button>
            <Observations obs={obs} />
            <ObservationsByDate obsMap={dateMap} />
        </div>
    )
}

export default RegionalObservations;