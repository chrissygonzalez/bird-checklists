import { useState, useEffect, MouseEventHandler } from "react";
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
    const [sort, setSort] = useState('date');
    const [birdMap, setBirdMap] = useState(new Map());

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
        setBirdMap(new Map());
    }, [selectedState]);

    useEffect(() => {
        localStorage.setItem('selectedRegion', selectedRegion);
        if (selectedRegion) {
            fetchObs();
        } else {
            setObs([]);
            setBirdMap(new Map());
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
                initialViewByDate(data);
                console.log(data);
            });
    }

    const getBirdDataMap = (birds: Observation[], field: string | number) => {
        const birdMap: Map<string, Observation[]> = new Map();
        for (const ob of birds) {
            const key = ob[field as keyof Observation];
            if (birdMap.has(String(key))) {
                const arr = birdMap.get(String(key));
                arr?.push(ob);
            } else {
                birdMap.set(String(key), [ob]);
            }
        }
        return birdMap;
    }

    const sortMapDecreasing = (a: [string, Observation[]], b: [string, Observation[]]) => {
        if (a[0] < b[0]) {
            return 1;
        } else if (a[0] === b[0]) {
            return 0;
        } else {
            return -1;
        }
    }

    const viewByBird = () => {
        const map = getBirdDataMap(obs, 'comName');
        const sorted = new Map([...map.entries()].sort());
        setBirdMap(sorted);
    }

    const initialViewByDate = (birds: Observation[]) => {
        const map = getBirdDataMap(birds, 'obsDt');
        const sorted = new Map([...map.entries()].sort(sortMapDecreasing));
        setBirdMap(sorted);
    }

    const viewByDate = () => {
        const map = getBirdDataMap(obs, 'obsDt');
        const sorted = new Map([...map.entries()].sort(sortMapDecreasing));
        setBirdMap(sorted);
    }

    const viewByLocation = () => {
        const map = getBirdDataMap(obs, 'locName');
        const sorted = new Map([...map.entries()].sort());
        setBirdMap(sorted);
    }

    return (
        <div className="inputs">
            <div>
                <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            </div>
            <button onClick={viewByDate}>Sort by date</button>
            <button onClick={viewByBird}>Sort by bird name</button>
            <button onClick={viewByLocation}>Sort by location</button>
            <ObservationsByDate obsMap={birdMap} />
        </div>
    )
}

export default RegionalObservations;