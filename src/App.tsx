import './App.css'
import RegionalObservations from './components/RegionalObservations';

function App() {
  return (
    <>
      <h1>Bird Observations</h1>
      <h3>Who's been hanging around?</h3>
      <div className="flex">
        <RegionalObservations />
      </div>
    </>
  )
}

export default App