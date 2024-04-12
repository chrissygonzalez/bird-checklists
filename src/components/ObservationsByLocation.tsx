import { Map as GMap, AdvancedMarker, useMap, Pin } from '@vis.gl/react-google-maps';
import { useState, useEffect } from "react";
import { Observation } from "../types";

type Location = {
    key: string;
    lat: string;
    lng: string;
    name: string;
}

const CustomPin = ({ name }: { name: string }) => {
    return (
        <div className="location-pin">
            {/* <p>{name}</p> */}
            <Pin />
        </div>)
}

const CustomMarker = ({ mkr, bounds }: { mkr: Location, bounds: google.maps.LatLngBounds }) => {
    const map = useMap();
    map?.fitBounds(bounds, 0);
    return (<AdvancedMarker onClick={() => console.log(mkr.name)} position={{ lat: Number(mkr.lat), lng: Number(mkr.lng) }}>
        {/* <CustomPin name={mkr.name} /> */}
        <Pin />
    </AdvancedMarker>)
}

const ObservationsByLocation = ({ birds, locationMap }: { birds: Observation[], locationMap: Map<string, string> }) => {
    const [center, setCenter] = useState<google.maps.LatLng>();
    const [markers, setMarkers] = useState<Map<string, Location>>(new Map());
    const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>(new window.google.maps.LatLngBounds());
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
                name: locationMap.get(ob.locId) || 'unknown',
            }
            if (!mks.has(locInfo.key))
                mks.set(locInfo.key, locInfo);
        }
        setMapBounds(bounds);
        setCenter(bounds.getCenter());
        setMarkers(mks);
    }, [birds]);

    return (
        <div className='flex'>
            <div>
                {Array.from(markers).sort((a, b) => a[1].name < b[1].name ? -1 : 1).map(([k, v]) => <p key={k}>{v.name}</p>)}
            </div>
            <GMap
                mapId='birdLocations'
                style={{ width: '80vw', height: '80vh' }}
                defaultZoom={8}
                defaultCenter={{ lat: 43.64, lng: -79.41 }}
                center={center}
                gestureHandling={'greedy'}
                disableDefaultUI={false}>
                {Array.from(markers).map(([_, v]) => <CustomMarker mkr={v} bounds={mapBounds} />)}
            </GMap>
        </div>)
}

export default ObservationsByLocation;