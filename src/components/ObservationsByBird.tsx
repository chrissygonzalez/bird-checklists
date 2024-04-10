import { useEffect, useState } from "react";
import { Observation } from "../types";
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

const Obs = ({ ob, handleClick }: { ob: Observation, handleClick: () => void }) => {
    return <div className="bird">
        <p className="bird-name" onClick={handleClick}>{ob.comName}</p>
        <p className="bird-species">{ob.sciName}</p>
    </div>
}

const Checklist = ({ list, speciesMap, locationMap }: { list: Checklist, speciesMap: Map<string, string>, locationMap: Map<string, string> }) => {
    return (
        <div className="checklist">
            <p>{formatDate(list.obsDt)}</p>
            <p>{list.userDisplayName}</p>
            <p>Location ID: {locationMap.get(list.locId)}</p>
            <ul>{list.obs.map(ob => {
                if (speciesMap.has(ob.speciesCode)) {
                    return <li>{speciesMap.get(ob.speciesCode)} {ob.howManyStr !== 'X' ? ob.howManyStr : ''}</li>
                }
            })}</ul>
        </div>)
}

const ObservationsByBird = ({ birds, speciesMap, locationMap }: { birds: Observation[], speciesMap: Map<string, string>, locationMap: Map<string, string> }) => {
    const [obsMap, setObsMap] = useState<Map<string, Observation[]>>(new Map());
    const [checklist, setChecklist] = useState(undefined);

    let myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", `${import.meta.env.VITE_EBIRD_KEY}`);
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const fetchChecklist = (id: string) => {
        fetch(`https://api.ebird.org/v2/product/checklist/view/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                setChecklist(data);
                console.log(data);
            });
    }

    useEffect(() => {
        const birdMap: Map<string, Observation[]> = new Map();
        for (const ob of birds) {
            const key = ob['comName'][0];
            if (birdMap.has(String(key))) {
                const arr = birdMap.get(String(key));
                arr?.push(ob);
            } else {
                birdMap.set(String(key), [ob]);
            }
        }
        const sorted = new Map([...birdMap.entries()].sort())
        setObsMap(sorted);
    }, []);

    const keys = Array.from(obsMap.keys());
    return (
        <>
            {checklist && <Checklist list={checklist} speciesMap={speciesMap} locationMap={locationMap} />}
            <div className="bird-container">
                {keys.map(key => {
                    return (
                        <div key={key} className="bird-letter">
                            <h3 className="bird-alpha">{key}</h3>
                            {obsMap?.get(key)?.map(ob => <Obs ob={ob} key={ob.subId + ob.speciesCode} handleClick={() => fetchChecklist(ob.subId)} />)}
                        </div>)
                })}
            </div>
        </>
    )
}

export default ObservationsByBird;