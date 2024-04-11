import { APIProvider } from '@vis.gl/react-google-maps';
import './App.css'
import RegionalObservations from './components/RegionalObservations';

function App() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <RegionalObservations />
    </APIProvider>
  )
}

export default App