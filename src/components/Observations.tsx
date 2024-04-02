import { Observation } from "../types";

const Observations = ({ obs }: { obs: Observation[] }) => {
    return (<div className="obs-container">
        {obs.length > 0 && obs.map((ob: Observation) => {
            const dateOptions: Intl.DateTimeFormatOptions = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            };
            const formattedDate = new Date(ob.obsDt).toLocaleDateString(undefined, dateOptions);
            return <div key={ob.subId + ob.speciesCode} className="observation">
                <p>{ob.comName} ({ob.howMany})</p>
                <p className="location">{ob.locName}</p>
                <p className="location">{formattedDate}</p>
            </div>
        })}
    </div>)
}

export default Observations;