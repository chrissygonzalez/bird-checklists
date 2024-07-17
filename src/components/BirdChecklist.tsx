import { formatDate } from "../helpers";
import { BirdChecklistType } from "../types";

const BirdChecklist = ({ list, speciesMap, locationMap, onClose }: BirdChecklistType) => {
    return (
        <div className="checklist-container" onClick={onClose}>
            <dialog className="checklist" onClick={onClose}>
                <p className="checklist-head">Seen at {locationMap.get(list.locId)}</p>
                <p className="checklist-name">{formatDate(list.obsDt)}{list.userDisplayName && ` • Checklist by ${list.userDisplayName}`}</p>
                <ul tabIndex={0}>{list.obs.sort((a, b) => a.speciesCode < b.speciesCode ? -1 : 1).map(ob => {
                    if (speciesMap.has(ob.speciesCode)) {
                        return <li key={ob.speciesCode}>{speciesMap.get(ob.speciesCode)} {ob.howManyStr !== 'X' ? `• ${ob.howManyStr}` : ''}</li>
                    } else {
                        return <li key={ob.speciesCode}>{ob.speciesCode} <span className="checklist-exception">(species code)</span> {ob.howManyStr !== 'X' ? `• ${ob.howManyStr}` : ''}</li>
                    }
                })}</ul>
            </dialog>
        </div>)
}

export default BirdChecklist;