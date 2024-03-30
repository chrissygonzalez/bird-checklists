import './App.css'
import ChecklistByRegion from './components/ChecklistByRegion';

function App() {
  // const [selectedState, setSelectedState] = useState('');
  // const [selectedRegion, setSelectedRegion] = useState('');
  // const { data: states, isLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");

  return (
    <>
      <h1>Bird Observations</h1>
      <h3>Where and when?</h3>
      <div className="flex">
        <ChecklistByRegion />
      </div>
    </>
  )
}

export default App