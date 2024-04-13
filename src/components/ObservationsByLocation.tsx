import { Map as GMap, AdvancedMarker, useMap, InfoWindow, useAdvancedMarkerRef, MapMouseEvent } from '@vis.gl/react-google-maps';
import { useState, useEffect } from "react";
import { Observation } from "../types";

type Location = {
    key: string;
    lat: string;
    lng: string;
    name: string;
}

const CustomMarker = ({ mkr, bounds, id, openWindows, handleClick }: { mkr: Location, bounds: google.maps.LatLngBounds, id: string, openWindows: Set<string>, handleClick: (id: string) => void }) => {
    const map = useMap();
    const [markerRef, marker] = useAdvancedMarkerRef();

    const handleMarkerClick = () => {
        handleClick(id);
    }

    useEffect(() => { map?.fitBounds(bounds, 0); }, [])

    return (
        <div>
            <AdvancedMarker onClick={handleMarkerClick} ref={markerRef} position={{ lat: Number(mkr.lat), lng: Number(mkr.lng) }} />
            {openWindows.has(id) && <InfoWindow anchor={marker}>
                {mkr.name}
            </InfoWindow>}
        </div>)
}

const ObservationsByLocation = ({ birds, locationMap }: { birds: Observation[], locationMap: Map<string, string> }) => {
    const [markers, setMarkers] = useState<Map<string, Location>>(new Map());
    const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>(new window.google.maps.LatLngBounds());
    const bounds = new window.google.maps.LatLngBounds();
    const [openWindows, setOpenWindows] = useState<Set<string>>(new Set());

    const handleMarkerClick = (id: string) => {
        const open = new Set(openWindows);
        if (open.has(id)) {
            open.delete(id)
        } else {
            open.add(id);
        }
        setOpenWindows(open);
    }

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
        setMarkers(mks);
    }, [birds]);

    return (
        <div className='flex'>
            <div>
                {Array.from(markers).sort((a, b) => a[1].name < b[1].name ? -1 : 1).map(([k, v]) => <p onClick={() => handleMarkerClick(k)} key={k}>{v.name}</p>)}
            </div>
            <GMap
                mapId='birdLocations'
                style={{ width: '80vw', height: '80vh' }}
                defaultZoom={8}
                defaultCenter={{ lat: 43.64, lng: -79.41 }}
                gestureHandling={'greedy'}
                disableDefaultUI={false}>
                {Array.from(markers).map(([k, v]) => <CustomMarker key={k} id={k} handleClick={handleMarkerClick} openWindows={openWindows} mkr={v} bounds={mapBounds} />)}
            </GMap>
        </div>)
}

export default ObservationsByLocation;