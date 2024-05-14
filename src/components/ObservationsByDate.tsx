import { useState, useEffect } from "react";
import { Observation } from "../types";
import { formatDateNav } from "../helpers";
import DateDetail from "./DateDetail";

const ObservationsByDate = ({ birds }: { birds: Observation[] }) => {
    const [obsMap, setObsMap] = useState<Map<string, Map<string, Observation[]>>>(new Map());
    const [days, setDays] = useState<string[]>([]);
    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {
        const birdMap: Map<string, Map<string, Observation[]>> = new Map();
        for (const ob of birds) {
            const day = new Date(ob['obsDt']).toLocaleDateString();
            const location = ob['locName'];

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
        birdMap.forEach((day, key) => {
            const sorted = new Map([...day.entries()].sort());
            birdMap.set(key, sorted);
        })
        const dayKeys = [...birdMap.keys()];
        setDays(dayKeys);
        setCurrentDay(dayKeys[0])
    }, [birds]);

    return (
        <div className="date-container">
            <div className="dates">
                {days.map(day => {
                    const dayData = obsMap.get(day) || [];
                    let totalSpecies = 0;
                    for (let entry of dayData) {
                        totalSpecies += entry[1].length;
                    }
                    return (
                        <div key={day} className={`date-nav ${day === currentDay ? 'date-selected' : ''}`} onClick={() => setCurrentDay(day)}>
                            <h3 className="date-nav-heading">{formatDateNav(day)}</h3>
                            {/* <p>{[...dayData.keys()].length} locations • {totalSpecies} species</p> */}
                        </div>
                    )
                })}
            </div>
            {currentDay && <DateDetail day={currentDay} obsMap={obsMap} />}
        </div>
    )
}

export default ObservationsByDate;