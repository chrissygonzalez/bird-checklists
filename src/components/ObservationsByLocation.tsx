import { Map as GMap } from '@vis.gl/react-google-maps';
import { useState, useEffect } from "react";
import { Observation, Location } from "../types";
import MapMarker from './MapMarker';

const ObservationsByLocation = ({ birds, locationMap }: { birds: Observation[], locationMap: Map<string, string> }) => {
    const [markers, setMarkers] = useState<Map<string, Location>>(new Map());
    const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>(new window.google.maps.LatLngBounds());
    const bounds = new window.google.maps.LatLngBounds();
    const [openWindows, setOpenWindows] = useState<Set<string>>(new Set());

    const handleMarkerClick = (id: string) => {
        const open = new Set(openWindows);
        if (open.has(id)) {
            open.clear();
        } else {
            open.clear();
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
        <div className='location-container'>
            <div className="location-name-container">
                {Array.from(markers).sort((a, b) => a[1].name < b[1].name ? -1 : 1).map(([k, v], index) => {
                    return (
                        <div className='location-name-item' key={k}>
                            <div className="location-number">{index + 1}</div>
                            <p className="location-name" onClick={() => handleMarkerClick(k)}>
                                {v.name}
                            </p>
                        </div>)
                })}
            </div>
            <GMap
                mapId='birdLocations'
                style={{ width: '70vw', height: '90vh' }}
                defaultZoom={8}
                defaultCenter={{ lat: 43.64, lng: -79.41 }}
                gestureHandling={'greedy'}
                disableDefaultUI={true}>
                {Array.from(markers).map(([k, v]) => <MapMarker key={k} id={k} handleClick={handleMarkerClick} openWindows={openWindows} mkr={v} bounds={mapBounds} />)}
            </GMap>
        </div>)
}

export default ObservationsByLocation;