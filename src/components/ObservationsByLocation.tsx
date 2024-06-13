import { Map as GMap } from '@vis.gl/react-google-maps';
import { useState, useEffect, useContext } from "react";
import { BirdActionEnum, BirdContext, BirdContextType, BirdDispatchContext } from "./BirdContext";
import { Location } from "../types";
import MapMarker from './MapMarker';

const ObservationsByLocation = () => {
    const {
        obs: birds,
        locationMap,
    } = useContext(BirdContext) as BirdContextType;
    const dispatch = useContext(BirdDispatchContext);
    const { selectedLocation } = useContext(BirdContext) as BirdContextType;
    const [markers, setMarkers] = useState<Map<string, Location>>(new Map());
    const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds>(new window.google.maps.LatLngBounds());
    const [openWindows, setOpenWindows] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (selectedLocation) {
            setOpenWindows(openWindows => openWindows.add(selectedLocation));
        }
    }, [selectedLocation]);

    const handleMarkerClick = (id: string) => {
        dispatch({ type: BirdActionEnum.CLEAR_SELECTED_LOCATION });
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
        const bounds = new window.google.maps.LatLngBounds();
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
    }, [birds, locationMap]);

    return (
        <>
            <h2 className="page-title">Recent observation locations</h2>
            <div className='location-container container'>
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
                    className='map'
                    mapId='birdLocations'
                    defaultZoom={8}
                    defaultCenter={{ lat: 43.64, lng: -79.41 }}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}>
                    {Array.from(markers).map(([k, v]) =>
                        <MapMarker key={k} id={k} handleClick={handleMarkerClick} openWindows={openWindows} mkr={v} bounds={mapBounds} />)}
                </GMap>
            </div></>)
}

export default ObservationsByLocation;