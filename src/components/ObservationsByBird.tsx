import { useEffect, useState, useContext } from "react";
import { createPortal } from 'react-dom';
import { Checklist, Observation } from "../types";
import { BirdContext, BirdContextType } from "./BirdContext";
import BirdChecklist from "./BirdChecklist";

const BirdName = ({ ob, handleClick }: { ob: Observation, handleClick: () => void }) => {
    return <section className="bird">
        <p className="bird-name" onClick={handleClick}>{ob.comName}</p>
        <p className="bird-species">{ob.sciName}</p>
    </section>
}

const ObservationsByBird = () => {
    const {
        obs: birds,
        locationMap,
        speciesMap,
    } = useContext(BirdContext) as BirdContextType;
    const [obsMap, setObsMap] = useState<Map<string, Observation[]>>(new Map());
    const [checklist, setChecklist] = useState<Checklist | undefined>(undefined);

    const myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", `${import.meta.env.VITE_EBIRD_KEY}`);
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const fetchChecklist = (id: string) => {
        fetch(`https://api.ebird.org/v2/product/checklist/view/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                setChecklist(data);
            });
    }

    useEffect(() => {
        const birdMap: Map<string, Observation[]> = new Map();
        for (const ob of birds) {
            const key = ob['comName'][0];
            if (birdMap.has(String(key))) {
                const arr = birdMap.get(String(key));
                arr?.push(ob);
            } else {
                birdMap.set(String(key), [ob]);
            }
        }
        const sorted = new Map([...birdMap.entries()].sort())
        setObsMap(sorted);
    }, [birds]);

    const keys = Array.from(obsMap.keys());
    return (
        <>
            {checklist && createPortal(
                <BirdChecklist list={checklist} speciesMap={speciesMap} locationMap={locationMap} setChecklist={setChecklist} onClose={() => setChecklist(undefined)} />,
                document.body
            )}
            <h2 className="page-title">Recent bird species</h2>
            <div className="bird-container container">
                <div className="bird-letter-nav">
                    {keys.map(key => <a className="bird-letter-nav-item" key={key} href={'#' + key}>{key}</a>)}
                </div>
                <button className="bird-scroll-to-top" onClick={() => window.scrollTo(0, 0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" /></svg>
                </button>
                {keys.map(key => {
                    return (
                        <article className="bird-letter" key={key} id={key}>
                            <h3 className="bird-alpha">{key}</h3>
                            {obsMap?.get(key)?.map(ob =>
                                <BirdName ob={ob} key={ob.subId + ob.speciesCode} handleClick={() => fetchChecklist(ob.subId)} />
                            )}
                        </article>)
                })}
            </div>
        </>
    )
}

export default ObservationsByBird;