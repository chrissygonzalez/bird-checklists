import { EbirdRegion } from '../types';
import RegionSelect from './RegionSelect';
import RegionalStats from './RegionalStats';
import ChecklistFeed from './ChecklistFeed';

type ChecklistByRegion = {
    states: EbirdRegion[];
    selectedState: string;
    selectedRegion: string;
    setSelectedState: React.Dispatch<React.SetStateAction<string>>;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
}

const ChecklistByRegion = ({ states, selectedState, setSelectedState, selectedRegion, setSelectedRegion }: ChecklistByRegion) => {
    return (
        <div className="inputs">
            <select id="ebirdStates" onChange={(e) => {
                setSelectedState(e.target.value);
            }}>
                <option value={''}>Choose a state</option>
                {states?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
            </select>

            {selectedState && <RegionSelect selectedState={selectedState} setSelectedRegion={setSelectedRegion} />}
            {/* {selectedRegion && <RegionalStats selectedRegion={selectedRegion} />} */}
            {/* {selectedRegion && <ChecklistFeed selectedRegion={selectedRegion} />} */}
        </div>
    )
}

export default ChecklistByRegion;