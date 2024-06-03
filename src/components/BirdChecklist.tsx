import { formatDate } from "../helpers";
import { BirdChecklistType } from "../types";

const BirdChecklist = ({ list, speciesMap, locationMap, onClose }: BirdChecklistType) => {
    return (
        <div className="checklist" onClick={onClose}>
            <p>{formatDate(list.obsDt)}</p>
            <p>{list.userDisplayName}</p>
            <p>Location ID: {locationMap.get(list.locId)}</p>
            <ul>{list.obs.sort((a, b) => a.speciesCode < b.speciesCode ? -1 : 1).map(ob => {
                if (speciesMap.has(ob.speciesCode)) {
                    return <li key={ob.speciesCode}>{speciesMap.get(ob.speciesCode)} {ob.howManyStr !== 'X' ? `x ${ob.howManyStr}` : ''}</li>
                } else {
                    return <li key={ob.speciesCode}>[species code: {ob.speciesCode}] {ob.howManyStr !== 'X' ? `x ${ob.howManyStr}` : ''}</li>
                }
            })}</ul>
        </div>)
}

export default BirdChecklist;