import { useState, useEffect } from "react";
import { Observation } from "../types";
import { formatDate } from "../helpers";

const Obs = ({ ob }: { ob: Observation }) => {
    return <div>
        <p>{ob.howMany} &times; {ob.comName}</p>
    </div>
}

const Location = ({ location, obs }: { location: string, obs: Observation[] }) => {
    return (
        <div>
            {obs?.map(ob => <Obs ob={ob} key={ob.subId + ob.speciesCode} />)}
            {location && `Observed at ${location}`}
        </div>)
}

const ObservationsByDate = ({ birds }: { birds: Observation[] }) => {
    const [obsMap, setObsMap] = useState<Map<string, Map<string, Observation[]>>>(new Map());

    useEffect(() => {
        const birdMap: Map<string, Map<string, Observation[]>> = new Map();
        for (const ob of birds) {
            const day = new Date(ob['obsDt']).toLocaleDateString();
            const location = ob['locName'];
            // debugger;
            if (birdMap.has(day)) {
                const birdDate = birdMap.get(String(day));

                if (birdDate?.has(location)) {
                    const birdDateLoc = birdDate.get(String(location));
                    birdDateLoc?.push(ob);
                } else {
                    birdDate?.set(String(location), [ob]);
                }
            } else {
                const birdDateLoc = new Map();
                birdDateLoc.set(String(location), [ob]);
                birdMap.set(String(day), birdDateLoc);
            }
        }
        setObsMap(birdMap);
    }, [birds]);

    const days = Array.from(obsMap.keys());
    return (
        <div className="date-container">
            {days.map(day => {
                const locMap = obsMap.get(day);
                let locations: string[] = [];
                if (locMap && locMap.size > 0) {
                    locations = Array.from(locMap.keys());
                }

                return (
                    <div key={day} className="date-day">
                        <h3>{formatDate(day)}</h3>
                        {locations.map(loc => {
                            const obsAtLoc = locMap?.get(loc) || [];
                            return (
                                <Location key={loc} location={loc} obs={obsAtLoc} />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default ObservationsByDate;