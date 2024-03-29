import { useState } from 'react';
import useFetch from "../hooks/useFetch";
import ChecklistDetail from "./ChecklistDetail";

type Location = {
    locName: string;
}

type ChecklistItem = {
    loc: Location;
    subId: string;
    userDisplayName: string;
}

const ChecklistFeed = ({ selectedRegion }: { selectedRegion: string }) => {
    const [selectedChecklist, setSelectedChecklist] = useState<string>();
    const { data: checklistFeed }: { data: ChecklistItem[] } = useFetch(`https://api.ebird.org/v2/product/lists/${selectedRegion}/2024/3/21`);
    console.log(checklistFeed);

    return (
        <div>
            <ul>
                {checklistFeed?.map(({ loc, subId, userDisplayName }) => <li key={subId} onClick={() => setSelectedChecklist(subId)}>
                    {loc.locName} <p>{userDisplayName}</p>
                </li>)}
            </ul>
            {selectedChecklist && <ChecklistDetail subId={selectedChecklist} />}
        </div>
    )
}

export default ChecklistFeed;