import { useContext } from 'react';
import { BirdContext, BirdDispatchContext, BirdContextType, BirdActionEnum } from './BirdContext';
import { EbirdRegion } from "../types";

const RegionSelect = () => {
    const dispatch = useContext(BirdDispatchContext);
    const { regions, selectedRegion } = useContext(BirdContext) as BirdContextType;

    return (
        <select aria-label="Select a county" id="ebirdRegions" value={selectedRegion} onChange={(e) => dispatch({ type: BirdActionEnum.SELECT_REGION, payload: e.target.value })}>
            <option value={''}>Choose a region</option>
            {regions?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
        </select>
    )
}

export default RegionSelect;