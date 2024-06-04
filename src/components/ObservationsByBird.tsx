import { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { Checklist, Observation } from "../types";
import BirdChecklist from "./BirdChecklist";

const BirdName = ({ ob, handleClick }: { ob: Observation, handleClick: () => void }) => {
    return <div className="bird">
        <p className="bird-name" onClick={handleClick}>{ob.comName}</p>
        <p className="bird-species">{ob.sciName}</p>
    </div>
}

const ObservationsByBird = ({ birds, speciesMap, locationMap }: { birds: Observation[], speciesMap: Map<string, string>, locationMap: Map<string, string> }) => {
    const [obsMap, setObsMap] = useState<Map<string, Observation[]>>(new Map());
    const [checklist, setChecklist] = useState<Checklist | undefined>(undefined);

    const myHeaders = new Headers();
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
    }, [birds]);

    const keys = Array.from(obsMap.keys());
    return (
        <>
            {checklist && createPortal(
                <BirdChecklist list={checklist} speciesMap={speciesMap} locationMap={locationMap} setChecklist={setChecklist} onClose={() => setChecklist(undefined)} />,
                document.body
            )}
            <h2 className="page-title">Recent bird species</h2>
            <div className="bird-container container">
                {keys.map(key => {
                    return (
                        <div key={key} className="bird-letter">
                            <h3 className="bird-alpha">{key}</h3>
                            {obsMap?.get(key)?.map(ob =>
                                <BirdName ob={ob} key={ob.subId + ob.speciesCode} handleClick={() => fetchChecklist(ob.subId)} />
                            )}
                        </div>)
                })}
            </div>
        </>
    )
}

export default ObservationsByBird;