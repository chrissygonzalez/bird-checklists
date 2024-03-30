import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { EbirdRegion } from '../types';
import RegionSelect from './RegionSelect';

type ChecklistByRegion = {
    states: EbirdRegion[];
    selectedState: string;
    selectedRegion: string;
    setSelectedState: React.Dispatch<React.SetStateAction<string>>;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
}

const ChecklistByRegion = () => {
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
                console.log(data);
            });
    }

    return (
        <div className="inputs">
            <select id="ebirdStates" value={selectedState} onChange={(e) => {
                setSelectedState(e.target.value);
            }}>
                <option value={''}>Choose a state</option>
                {states?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
            </select>

            <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            {obs.length > 0 && obs.map(ob => <div key={ob.subId + ob.speciesCode}>{ob.comName}</div>)}
        </div>
    )
}

export default ChecklistByRegion;