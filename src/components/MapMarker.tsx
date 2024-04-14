import { useEffect } from 'react';
import { AdvancedMarker, useMap, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Location } from '../types';

const MapMarker = ({ mkr, bounds, id, openWindows, handleClick }: { mkr: Location, bounds: google.maps.LatLngBounds, id: string, openWindows: Set<string>, handleClick: (id: string) => void }) => {
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
                <p className='location-marker-name'>{mkr.name}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${mkr.lat},${mkr.lng}`} target='_blank' rel='noopener'>Open in Google Maps</a>
            </InfoWindow>}
        </div>)
}

export default MapMarker;