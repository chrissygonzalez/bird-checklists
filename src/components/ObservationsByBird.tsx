import { useEffect, useState } from "react";
import { Observation } from "../types";

const Obs = ({ ob }: { ob: Observation }) => {
    return <div className="bird">
        <p className="bird-name">{ob.comName}</p>
        <p className="bird-species">{ob.sciName}</p>
    </div>
}

const ObservationsByBird = ({ birds }: { birds: Observation[] }) => {
    const [obsMap, setObsMap] = useState<Map<string, Observation[]>>(new Map());

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
        <div className="bird-container">
            {keys.map(key => {
                return (
                    <div key={key} className="bird-letter">
                        <h3 className="bird-alpha">{key}</h3>
                        {obsMap?.get(key)?.map(ob => <Obs ob={ob} key={ob.subId + ob.speciesCode} />)}
                    </div>)
            })}
        </div>
    )
}

export default ObservationsByBird;