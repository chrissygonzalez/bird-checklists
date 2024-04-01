import { Observation } from "../types"

const Obs = ({ ob }: { ob: Observation }) => {
    return <div className="observation">
        <p>{ob.howMany} {ob.comName}{ob.howMany > 1 ? 's' : ''}</p>
        <p className="location">{ob.locName}</p>
    </div>
}

const ObservationsByDate = ({ obsMap }: { obsMap: Map<string, Observation[]> }) => {
    const keys = Array.from(obsMap.keys());
    return (
        <>
            {keys.map(key => <div key={key}>{key} {obsMap?.get(key)?.map(ob => <Obs ob={ob} key={ob.subId + ob.speciesCode} />)}</div>)}
        </>
    )
}

export default ObservationsByDate;