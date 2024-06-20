import { useState, useEffect, useContext } from "react";
import { BirdContext, BirdContextType } from "./BirdContext";
import { formatDateNav } from "../helpers";
import DateDetail from "./DateDetail";

const ObservationsByDate = () => {
    const {
        obs: birds,
        birdMap
    } = useContext(BirdContext) as BirdContextType;
    const [days, setDays] = useState<string[]>([]);
    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {
        birdMap.forEach((day, key) => {
            const sorted = new Map([...day.entries()].sort());
            birdMap.set(key, sorted);
        })
        const dayKeys = [...birdMap.keys()];
        setDays(dayKeys);
        setCurrentDay(dayKeys[0])
    }, [birds]);

    return (
        <>
            <h2 className="page-title">Recent bird observations</h2>
            <div className="date-container container">
                <div className="dates">
                    {days.map(day => {
                        const dayData = birdMap.get(day) || [];
                        const numLocations = [...dayData.keys()].length;
                        let totalSpecies = 0;
                        for (const entry of dayData) {
                            totalSpecies += entry[1].length;
                        }
                        return (
                            <div key={day} className={`date-nav ${day === currentDay ? 'date-selected' : ''}`} onClick={() => setCurrentDay(day)}>
                                <h3 className="date-nav-heading">{formatDateNav(day)}</h3>
                                <p className="date-nav-stats">{numLocations} location{numLocations > 1 ? 's' : ''} • {totalSpecies} species</p>
                            </div>
                        )
                    })}
                </div>
                {currentDay && <DateDetail day={currentDay} obsMap={birdMap} />}
            </div>
        </>
    )
}

export default ObservationsByDate;