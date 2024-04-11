import { Map as GMap, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useState, useEffect, useCallback } from "react";
import { Observation } from "../types";

type Location = {
    key: string;
    lat: string;
    lng: string;
    name?: string;
}

const ObservationsByLocation = ({ birds, locationMap }: { birds: Observation[], locationMap: Map<string, string> }) => {
    const [center, setCenter] = useState<google.maps.LatLng>();
    const [markers, setMarkers] = useState<Map<string, Location>>(new Map());
    const map = useMap('birdLocations');
    const bounds = new window.google.maps.LatLngBounds();

    useEffect(() => {
        const mks: Map<string, Location> = new Map();
        for (const ob of birds) {
            const pt = new google.maps.LatLng({ lat: Number(ob.lat), lng: Number(ob.lng) });
            bounds.extend(pt);
            const locInfo = {
                key: `${ob.lat}, ${ob.lng}`,
                lat: ob.lat,
                lng: ob.lng,
                name: locationMap.get(ob.locId),
            }
            if (!mks.has(locInfo.key))
                mks.set(locInfo.key, locInfo);
        }
        setCenter(bounds.getCenter());
        map?.fitBounds(bounds, 0);
        setMarkers(mks);
    }, [birds]);

    return (
        <div className='flex'>
            <div>
                Location
                {Array.from(markers).map(([k, v]) => <p key={k}>{v.name}, {v.lat}, , {v.lng}</p>)}
            </div>
            <GMap
                mapId='birdLocations'
                style={{ width: '80vw', height: '80vh' }}
                defaultZoom={10}
                defaultCenter={{ lat: 43.64, lng: -79.41 }}
                center={center}
                gestureHandling={'greedy'}
                disableDefaultUI={false}>
                {Array.from(markers).map(([_, v]) => <AdvancedMarker position={{ lat: Number(v.lat), lng: Number(v.lng) }} />)}
            </GMap>
        </div>)
}

export default ObservationsByLocation;