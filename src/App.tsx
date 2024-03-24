import { useState } from 'react';
import RegionSelect from './components/RegionSelect';
import RegionalStats from './components/RegionalStats';
import ChecklistFeed from './components/ChecklistFeed';
import useFetch from './hooks/useFetch';
import './App.css'
import { EbirdRegion } from './types';

function App() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US")

  // Get states: https://api.ebird.org/v2/ref/region/list/subnational1/US
  // Get regions in states: https://api.ebird.org/v2/ref/region/list/subnational2/US-NY
  // Get adjacent regions: https://api.ebird.org/v2/ref/adjacent/US-NY

  return (
    <>
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

      {/* 
      <div>{checklist?.obs?.map(({ howManyStr, speciesCode }) => <p key={speciesCode}>{speciesCode}: {howManyStr}</p>)}</div> */}
    </>
  )
}

export default App
