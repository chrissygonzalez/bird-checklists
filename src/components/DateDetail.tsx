import { useContext } from "react";
import { BirdContext, BirdContextType } from "./BirdContext";
import { Observation } from "../types";
import { formatDate } from "../helpers";

const BirdsAtLocation = ({ location, obs }: { location: string, obs: Observation[] }) => {
    const { setSelectedLocation, setViewType } = useContext(BirdContext) as BirdContextType;
    // debugger;
    const handleClick = () => {
        setSelectedLocation(`${obs[0].lat}, ${obs[0].lng}`);
        setViewType('location');
    }
    return (
        <div className="date-location">
            {location && <a onClick={handleClick} className="date-seen">{location}</a>}
            {obs?.sort((a, b) => a.comName < b.comName ? -1 : 1).map(ob => <p key={ob.subId + ob.speciesCode} className="date-obs">{ob.comName} • {ob.howMany}</p>)}
        </div>)
}

const DateDetail = ({ day, obsMap }: { day: string, obsMap: Map<string, Map<string, Observation[]>> }) => {
    const locMap = obsMap.get(day);
    let locations: string[] = [];
    if (locMap && locMap.size > 0) {
        locations = Array.from(locMap.keys());
    }

    return (
        <div className="date-detail">
            <h3 className="date-heading">{formatDate(day)}</h3>
            <div className="date-locations">
                {locations.map(loc => {
                    const obsAtLoc = locMap?.get(loc) || [];
                    return (
                        <BirdsAtLocation key={loc} location={loc} obs={obsAtLoc} />
                    )
                })}
            </div>
        </div>
    )
}

export default DateDetail;