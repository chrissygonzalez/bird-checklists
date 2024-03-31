import { EbirdRegion } from "../types";

type StateSelect = {
    states: EbirdRegion[];
    selectedState: string;
    setSelectedState: React.Dispatch<React.SetStateAction<string>>;
}

const StateSelect = ({ states, selectedState, setSelectedState }: StateSelect) => {
    return (<select id="ebirdStates" value={selectedState} onChange={(e) => {
        setSelectedState(e.target.value);
    }}>
        <option value={''}>Choose a state</option>
        {states?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
    </select>)
}

export default StateSelect;