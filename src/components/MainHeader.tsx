import { useContext } from 'react';
import RegionSelect from './RegionSelect';
import StateSelect from "./StateSelect";
import ViewNav from "./ViewNav";
import { BirdContext, BirdContextType } from './BirdContext';
import { Observation } from '../types';
import BirdLogo from './BirdLogo';

type MainHeader = {
    obs: Observation[];
}

const MainHeader = ({ obs }: MainHeader) => {
    const { states, regions, selectedState, selectedRegion, setSelectedState, setSelectedRegion, viewType, setViewType } = useContext(BirdContext) as BirdContextType;
    return (
        <header>
            <div className="header-flex">
                <div className="logo-header" onClick={() => setViewType('date')}>
                    <BirdLogo />
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