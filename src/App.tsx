import { useState, useEffect } from 'react';
import useFetch from './hooks/useFetch';
import './App.css'
import ChecklistByRegion from './components/ChecklistByRegion';
import GetLocationWrapper from './components/GetLocationWrapper';
import ChecklistFeed from './components/ChecklistFeed';
import RegionalStats from './components/RegionalStats';

function App() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showNearby, setShowNearby] = useState(false);
  const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");

  return (
    <>
      <h1>Recent Bird Obervations</h1>
      <h3>Use your location to see recent nearby observations</h3>
      <h3>See observations in a region by date</h3>
      <div className="flex">
        {!showNearby && <ChecklistByRegion
          states={states}
          selectedRegion={selectedRegion}
          selectedState={selectedState}
          setSelectedRegion={setSelectedRegion}
          setSelectedState={setSelectedState}
        />}
        {!selectedRegion && !showNearby && <><p>or</p><button onClick={() => setShowNearby(true)}>Use your current location</button></>}
        {(selectedRegion || showNearby) && <button onClick={() => {
          setSelectedRegion('');
          setSelectedState('');
          setShowNearby(false);
        }}>Reset</button>}
      </div>
      {showNearby && <GetLocationWrapper />}
      {selectedRegion && <RegionalStats selectedRegion={selectedRegion} />}
      {selectedRegion && <ChecklistFeed selectedRegion={selectedRegion} />}
    </>
  )
}

export default App