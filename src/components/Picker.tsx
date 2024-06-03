import { useContext } from "react";
import { BirdContext, BirdContextType } from "./BirdContext";
import { EbirdRegion } from "../types";

const Picker = () => {
    const {
        states,
        setSelectedState,
        selectedStateName,
        regions,
        setSelectedRegion } = useContext(BirdContext) as BirdContextType;
    const stateButtons = states?.map((state: EbirdRegion) =>
        <button className="picker" key={state.code} onClick={() => setSelectedState(state.code)}>{state.name}</button>);
    const regionButtons = regions?.map((region: EbirdRegion) =>
        <button className="picker" key={region.code} onClick={() => setSelectedRegion(region.code)}>{region.name}</button>)
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