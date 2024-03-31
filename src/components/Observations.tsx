import { Observation } from "../types";

const Observations = ({ obs }: { obs: Observation[] }) => {
    return (<div>
        {obs.length > 0 && obs.map((ob: Observation) => {
            const dateOptions: Intl.DateTimeFormatOptions = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            };
            const formattedDate = new Date(ob.obsDt).toLocaleDateString(undefined, dateOptions);
            return <div key={ob.subId + ob.speciesCode} className="observation">
                <p className="location">{formattedDate}</p>
                <p>{ob.howMany} {ob.comName}{ob.howMany > 1 ? 's' : ''}</p>
                <p className="location">{ob.locName}</p>
            </div>
        })}
    </div>)
}

export default Observations;