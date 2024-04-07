import { useState, useEffect } from "react";
import { Observation } from "../types";

const ObservationsByLocation = ({ birds }: { birds: Observation[] }) => {
    const [obsMap, setObsMap] = useState<Map<string, Observation[]>>(new Map());
    const [locSet, setLocSet] = useState<Set<string>>(new Set());
    const [minLat, setMinLat] = useState(Number(birds[0].lat));
    const [maxLat, setMaxLat] = useState(Number(birds[0].lat));
    const [minLng, setMinLng] = useState(Number(birds[0].lng));
    const [maxLng, setMaxLng] = useState(Number(birds[0].lng));

    useEffect(() => {
        const locations: Set<string> = new Set();
        for (const ob of birds) {
            if (Number(ob.lat) < minLat) setMinLat(Number(ob.lng));
            if (Number(ob.lat) > maxLat) setMaxLat(Number(ob.lng));
            if (Number(ob.lng) < minLng) setMinLng(Number(ob.lat));
            if (Number(ob.lng) > maxLng) setMaxLng(Number(ob.lat));

            if (!locations.has(ob.locName)) {
                locations.add(ob.locName);
            }
        }
        setLocSet(locations);
    }, [birds]);

    return (
        <div>
            Location
            {minLat} {maxLat} {minLng} {maxLng}
            {Array.from(locSet).sort().map((loc, index) => <p key={loc + index}>{loc}</p>)}
        </div>)
}

export default ObservationsByLocation;