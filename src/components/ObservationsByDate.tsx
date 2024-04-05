import { Observation } from "../types"
import { formatDate } from "../helpers"

const Obs = ({ ob }: { ob: Observation }) => {
    return <div>
        <p>{ob.howMany} &times; {ob.comName}</p>
    </div>
}

const ObservationsByDate = ({ obsMap }: { obsMap: Map<string, Observation[]> }) => {
    const keys = Array.from(obsMap.keys());
    return (
        <div className="date-container">
            {keys.map(key => {
                let location = '';
                let obs = obsMap.get(key);
                if (obs && obs.length > 0) {
                    location = obs[0].locName;
                }
                return (
                    <div key={key} className="date-day">
                        <h3>{formatDate(key)}</h3>
                        {obsMap?.get(key)?.map(ob => <Obs ob={ob} key={ob.subId + ob.speciesCode} />)}
                        {location && `Observed at ${location}`}
                    </div>
                )
            })}
        </div>
    )
}

export default ObservationsByDate;