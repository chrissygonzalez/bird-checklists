import { Observation } from "../types";

const Obs = ({ ob }: { ob: Observation }) => {
    return <div className="bird">
        <p className="bird-name">{ob.comName}</p>
        <p className="bird-species">{ob.sciName}</p>
    </div>
}

const ObservationsByBird = ({ obsMap }: { obsMap: Map<string, Observation[]> }) => {
    const keys = Array.from(obsMap.keys());
    return (
        <div className="bird-container">
            {keys.map(key => <div key={key} className="bird-letter"><h3 className="bird-alpha">{key}</h3> {obsMap?.get(key)?.map(ob => <Obs ob={ob} key={ob.subId + ob.speciesCode} />)}</div>)}
        </div>
    )
}

export default ObservationsByBird;