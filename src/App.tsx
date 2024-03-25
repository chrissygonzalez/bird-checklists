import { useState, useEffect } from 'react';
import RegionSelect from './components/RegionSelect';
import RegionalStats from './components/RegionalStats';
import ChecklistFeed from './components/ChecklistFeed';
import useFetch from './hooks/useFetch';
import './App.css'
import { EbirdRegion } from './types';
import NearbyObservations from './components/NearbyObservations';

function App() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [hasLocation, setHasLocation] = useState(false);
  const [latLong, setLatLong] = useState({ lat: '', long: '' });
  const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");

  useEffect(() => {
    if ("geolocation" in navigator) {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          // if (position) {
          setHasLocation(true);
          const lat = position.coords.latitude.toFixed(2);
          const long = position.coords.longitude.toFixed(2);
          setLatLong({ lat, long });
          // }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [])
  // Get states: https://api.ebird.org/v2/ref/region/list/subnational1/US
  // Get regions in states: https://api.ebird.org/v2/ref/region/list/subnational2/US-NY
  // Get adjacent regions: https://api.ebird.org/v2/ref/adjacent/US-NY

  return (
    <>
      {hasLocation && <NearbyObservations lat={latLong.lat} long={latLong.long} />}
      <div className="card">
        <label htmlFor="ebirdStates">Choose a state</label>
        <select id="ebirdStates" onChange={(e) => {
          setSelectedState(e.target.value);
        }}>
          <option value={''}>Choose a state</option>
          {states?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
        </select>

        {selectedState && <RegionSelect selectedState={selectedState} setSelectedRegion={setSelectedRegion} />}
        {selectedRegion && <RegionalStats selectedRegion={selectedRegion} />}
        {selectedRegion && <ChecklistFeed selectedRegion={selectedRegion} />}
      </div>
    </>
  )
}

export default App
