import { useContext } from 'react';
import RegionSelect from './RegionSelect';
import StateSelect from "./StateSelect";
import ViewNav from "./ViewNav";
import { BirdContext, BirdContextType } from './BirdContext';
import { EbirdRegion, Observation } from '../types';
import Bird from '../assets/bird.svg';

type MainHeader = {
    states: EbirdRegion[];
    regions: EbirdRegion[];
    selectedState: string;
    selectedRegion: string;
    setSelectedState: React.Dispatch<React.SetStateAction<string>>;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
    obs: Observation[];
}

const MainHeader = ({ states, regions, selectedState, selectedRegion, setSelectedState, setSelectedRegion, obs }: MainHeader) => {
    const { viewType, setViewType } = useContext(BirdContext) as BirdContextType;
    return (
        <header>
            <div className="header-flex">
                <div className="logo-header">
                    <img className="logo" src={Bird} alt={"bird icon"}></img>
                    <h1 className='langar-regular header-text' onClick={() => setViewType('date')}>Birds in the Neighborhood</h1>
                </div>
                <StateSelect states={states} selectedState={selectedState} setSelectedState={setSelectedState} />
                <RegionSelect regions={regions} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
            </div>
            {obs?.length > 0 && <ViewNav viewType={viewType} setViewType={setViewType} />}
        </header>
    )
}

export default MainHeader;