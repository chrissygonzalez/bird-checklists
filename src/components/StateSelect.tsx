import { useContext } from 'react';
import { BirdContext, BirdDispatchContext, BirdContextType, BirdActionEnum } from './BirdContext';
import { EbirdRegion } from "../types";

const StateSelect = () => {
    const dispatch = useContext(BirdDispatchContext);
    const { states, selectedState } = useContext(BirdContext) as BirdContextType;

    return (
        <select aria-label="Select a state" id="ebirdStates" value={selectedState} onChange={(e) => {
            dispatch({ type: BirdActionEnum.SELECT_STATE, payload: e.target.value });
        }}>
            <option value={''}>Choose a state</option>
            {states?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
        </select>
    )
}

export default StateSelect;