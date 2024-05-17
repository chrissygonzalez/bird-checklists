import { SetStateAction } from "react";
import { formatDate } from "../helpers";

type ChecklistObservation = {
    speciesCode: string;
    howManyStr: string;
}

type Checklist = {
    obsDt: string;
    userDisplayName: string;
    locId: string;
    obs: ChecklistObservation[];
}

type BirdChecklist = {
    list: Checklist;
    speciesMap: Map<string, string>;
    locationMap: Map<string, string>;
    setChecklist: React.Dispatch<SetStateAction<undefined>>;
}

const BirdChecklist = ({ list, speciesMap, locationMap, setChecklist }: BirdChecklist) => {
    return (
        <div className="checklist" onClick={() => setChecklist(undefined)}>
            <p>{formatDate(list.obsDt)}</p>
            <p>{list.userDisplayName}</p>
            <p>Location ID: {locationMap.get(list.locId)}</p>
            <ul>{list.obs.map(ob => {
                if (speciesMap.has(ob.speciesCode)) {
                    return <li key={ob.speciesCode}>{speciesMap.get(ob.speciesCode)} {ob.howManyStr !== 'X' ? ob.howManyStr : ''}</li>
                }
            })}</ul>
        </div>)
}

export default BirdChecklist;