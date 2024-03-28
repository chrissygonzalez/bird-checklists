import { useState, useEffect } from "react";
import NearbyObservations from "./NearbyObservations";

const GetLocationWrapper = () => {
    const [latLong, setLatLong] = useState({ lat: '', long: '' });
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationPerm, setLocationPerm] = useState('');

    const getLocation = () => {
        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(2);
            const long = position.coords.longitude.toFixed(2);
            setLatLong({ lat, long });
            setIsLoadingLocation(false);
        }
        )
    };

    useEffect(() => {
        if ("geolocation" in navigator) {
            try {
                navigator.permissions.query({ name: "geolocation" }).then((result) => {
                    if (result.state === 'granted' || result.state === 'prompt') {
                        getLocation();
                    }
                    result.onchange = function () {
                        if (this.state === 'denied') {
                            setLocationPerm('denied');
                        } else if (this.state === 'prompt') {
                            setLocationPerm('prompt');
                        } else if (this.state === 'granted') {
                            setLocationPerm('granted');
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    }, [locationPerm])

    return (latLong.lat && latLong.long ? <NearbyObservations lat={latLong.lat} long={latLong.long} /> : <div>Loading</div>)
}

export default GetLocationWrapper;