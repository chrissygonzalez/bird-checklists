import './App.css'
import ChecklistByRegion from './components/ChecklistByRegion';

function App() {
  return (
    <>
      <h1>Bird Observations</h1>
      <h3>Who's been hanging around?</h3>
      <div className="flex">
        <ChecklistByRegion />
      </div>
    </>
  )
}

export default App