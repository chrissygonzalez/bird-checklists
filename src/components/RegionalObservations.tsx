import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { Observation } from '../types';
import RegionSelect from './RegionSelect';
import StateSelect from "./StateSelect";
import ObservationsByDate from "./ObservationsByDate";
import ObservationsByBird from "./ObservationsByBird";
import ObservationsByLocation from "./ObservationsByLocation";

const RegionalObservations = () => {
    const [selectedState, setSelectedState] = useState(localStorage.getItem('selectedState') || '');
    const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem('selectedRegion') || '');
    const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");
    const [regions, setRegions] = useState([]);
    const [obs, setObs] = useState<Observation[]>([]);
    const [viewType, setViewType] = useState('date');

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

    // TODO: make map of location ids / names and species codes / names to use as dictionaries
    const fetchObs = () => {
        fetch(`https://api.ebird.org/v2/data/obs/${selectedRegion}/recent?back=30`, requestOptions)
            .then(res => res.json())
            .then(data => {
                setObs(data);
                console.log(data);
            });
    }

    return (
        <div>
            <header>
                <h1 className='langar-regular header-text'>Neighborhood Birds</h1>
                <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            </header>
            <nav>
                <div></div>
                <div className="flex">
                    <p>View by:</p>
                    <button className={viewType === 'date' ? 'selected' : ''} onClick={() => setViewType('date')}>Date</button>
                    <button className={viewType === 'bird' ? 'selected' : ''} onClick={() => setViewType('bird')}>Name</button>
                    <button className={viewType === 'location' ? 'selected' : ''} onClick={() => setViewType('location')}>Location</button>
                </div>
            </nav>
            {viewType === 'date' && <ObservationsByDate birds={obs} />}
            {viewType === 'bird' && <ObservationsByBird birds={obs} />}
            {viewType === 'location' && <ObservationsByLocation birds={obs} />}
        </div>
    )
}

export default RegionalObservations;