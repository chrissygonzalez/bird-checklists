import { useContext } from "react";
import { BirdContext, BirdContextType, BirdDispatchContext, BirdActionEnum } from "./BirdContext";
import { EbirdRegion } from "../types";

const Picker = () => {
    const dispatch = useContext(BirdDispatchContext);
    const { states, regions, selectedStateName } = useContext(BirdContext) as BirdContextType;

    const stateButtons = states?.map((state: EbirdRegion) =>
        <button className="picker" key={state.code} onClick={() => dispatch({ type: BirdActionEnum.SELECT_STATE, payload: state.code })}>{state.name}</button>);
    const regionButtons = regions?.map((region: EbirdRegion) =>
        <button className="picker" key={region.code} onClick={() => dispatch({ type: BirdActionEnum.SELECT_REGION, payload: region.code })}>{region.name}</button>)
    return (
        <div className="picker-view">
            <h2 className="picker-page-title">Explore recent bird observations in the United States</h2>
            <h3 className="picker-title">Choose a {regions.length === 0 ? "state to get started:" : `region in ${selectedStateName}:`}</h3>
            <div className="picker-container">
                {regions.length === 0 ? stateButtons : regionButtons}
            </div>
        </div>
    )
}

export default Picker;