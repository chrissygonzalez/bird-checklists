import { useState, useEffect } from 'react';
import useFetch from './hooks/useFetch';
import './App.css'
import NearbyObservations from './components/NearbyObservations';
import ChecklistByRegion from './components/ChecklistByRegion';

function App() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationPerm, setLocationPerm] = useState('');
  const [hasLocation, setHasLocation] = useState(false);
  const [latLong, setLatLong] = useState({ lat: '', long: '' });
  const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");

  const getLocation = () => {
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition((position) => {
      setHasLocation(true);
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
          if (result.state === 'granted') {
            getLocation();
          }
          if (result.state === 'prompt') {
            setLocationPerm('prompt');
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

  return (
    <>
      <h1>Recent Birds Near You</h1>
      {locationPerm === 'prompt' && <div>Allow location permissions to see nearby bird observations</div>}
      {/* {isLoadingLocation && <div>Loading</div>} */}
      {hasLocation && <NearbyObservations lat={latLong.lat} long={latLong.long} />}
      {!hasLocation && !isLoadingLocation && <ChecklistByRegion
        states={states}
        selectedRegion={selectedRegion}
        selectedState={selectedState}
        setSelectedRegion={setSelectedRegion}
        setSelectedState={setSelectedState}
      />}
    </>
  )
}

export default App