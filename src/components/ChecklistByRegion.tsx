import { useState } from "react";
import { EbirdRegion } from '../types';
import RegionSelect from './RegionSelect';

type ChecklistByRegion = {
    states: EbirdRegion[];
    selectedState: string;
    selectedRegion: string;
    setSelectedState: React.Dispatch<React.SetStateAction<string>>;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
}

const ChecklistByRegion = ({ states, selectedState, selectedRegion, setSelectedState, setSelectedRegion }: ChecklistByRegion) => {
    const [regions, setRegions] = useState([]);

    const fetchRegions = (state: string) => {
        let myHeaders = new Headers();
        myHeaders.append("X-eBirdApiToken", `${import.meta.env.VITE_EBIRD_KEY}`);

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://api.ebird.org/v2/ref/region/list/subnational2/${state}`, requestOptions)
            .then(res => res.json())
            .then(data => setRegions(data));
    }

    return (
        <div className="inputs">
            <select id="ebirdStates" value={selectedState} onChange={(e) => {
                setSelectedState(e.target.value);
                fetchRegions(e.target.value);
            }}>
                <option value={''}>Choose a state</option>
                {states?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
            </select>

            <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            <input type="date"></input>
            <button>Get observations</button>
        </div>
    )
}

export default ChecklistByRegion;