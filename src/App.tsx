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
      <h3>Choose an eBird region or use your location</h3>
      <div className="flex">
        <ChecklistByRegion
          states={states}
          selectedRegion={selectedRegion}
          selectedState={selectedState}
          setSelectedRegion={setSelectedRegion}
          setSelectedState={setSelectedState}
        />
        <button onClick={() => setShowNearby(true)}>Find birds near me</button>
      </div>
      {showNearby && <GetLocationWrapper />}
      {selectedRegion && <RegionalStats selectedRegion={selectedRegion} />}
      {selectedRegion && <ChecklistFeed selectedRegion={selectedRegion} />}
    </>
  )
}

export default App