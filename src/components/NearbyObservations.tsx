import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

type Location = { lat: string; long: string; }

type Observation = {
    subId: string;
    comName: string;
    sciName: string;
    locName: string;
    howMany: number;
    obsDt: string;
    speciesCode: string;
}

const NearbyObservations = ({ lat, long }: Location) => {
    const [loading, setLoading] = useState(true);
    const { data: nearby, isLoading } = useFetch(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${long}&maxResults=50&dist=5`);

    useEffect(() => {
        if (nearby) {
            setLoading(false);
        }
    }, [nearby])

    return (
        <div>
            {loading && <div>nearby observations requested</div>}
            {nearby?.map((obs: Observation) => {
                const date = new Date(obs.obsDt);
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                };
                const formatted = date.toLocaleDateString(undefined, options);
                return (
                    <div className="observation" key={obs.subId + obs.speciesCode}>
                        <p>{obs.howMany}</p>
                        <div>
                            <p>{obs.comName} ({obs.sciName})</p>
                            <p>{obs.locName}</p>
                            <p>on {formatted}</p>
                        </div>
                    </div>)
            })}
        </div>
    )
}

export default NearbyObservations;