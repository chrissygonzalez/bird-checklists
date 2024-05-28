import { APIProvider } from '@vis.gl/react-google-maps';
import './App.css';
import { BirdProvider } from "./components/BirdContext";
import RegionalObservations from './components/RegionalObservations';

function App() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <BirdProvider>
        <RegionalObservations />
      </BirdProvider>
    </APIProvider>
  )
}

export default App