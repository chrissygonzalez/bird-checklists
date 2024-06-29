import { useState, useEffect, useContext } from "react";
import { BirdContext, BirdContextType } from "./BirdContext";
import { formatDateNav } from "../helpers";
import DateDetail from "./DateDetail";

const ObservationsByDate = () => {
    const dayElements = [...document.querySelectorAll<HTMLElement>(".date-nav")];
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
                <div className="dates" role="navigation" aria-label="Observation dates">
                    {days.map(day => {
                        const dayData = birdMap.get(day) || [];
                        const numLocations = [...dayData.keys()].length;
                        let totalSpecies = 0;
                        for (const entry of dayData) {
                            // add up the number of species seen on each day
                            totalSpecies += entry[1].length;
                        }
                        return (
                            <div
                                data-day={day}
                                key={day}
                                tabIndex={0}
                                className={`date-nav ${day === currentDay ? 'date-selected' : ''}`}
                                onKeyDown={(e) => {
                                    if (document.activeElement?.getAttribute("class")?.includes("date-nav")) {
                                        if (e.code === "Enter") { setCurrentDay(day) };
                                        if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                                            const index = dayElements.findIndex((item) => item.dataset.day === day);
                                            if (index >= 0 && e.code === "ArrowUp") {
                                                const newIndex = (index - 1 + dayElements.length) % dayElements.length;
                                                dayElements[newIndex].focus();
                                            };
                                            if (index >= 0 && e.code === "ArrowDown") {
                                                const newIndex = (index + 1) % dayElements.length;
                                                dayElements[newIndex].focus();
                                            };
                                        }
                                    }
                                }}
                                onClick={() => setCurrentDay(day)}>
                                <h3 className="date-nav-heading">{formatDateNav(day)}</h3>
                                <p className="date-nav-stats">
                                    {numLocations} location{numLocations > 1 ? 's' : ''} • {totalSpecies} species
                                </p>
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