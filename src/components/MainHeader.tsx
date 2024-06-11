import { useContext } from 'react';
import RegionSelect from './RegionSelect';
import StateSelect from "./StateSelect";
import ViewNav from "./ViewNav";
import { BirdDispatchContext, BirdActionEnum } from './BirdContext';
import { Observation } from '../types';
import BirdLogo from './BirdLogo';

type MainHeader = {
    obs: Observation[];
}

const MainHeader = ({ obs }: MainHeader) => {
    const dispatch = useContext(BirdDispatchContext);

    return (
        <header>
            <div className="header-flex">
                <div className="logo-header" onClick={() => dispatch({ type: 'SET_VIEW_TYPE', payload: 'date' })}>
                    <BirdLogo />
                    <h1 className='langar-regular header-text' onClick={() => dispatch({ type: BirdActionEnum.SET_VIEW_TYPE, payload: 'date' })}>Birds in the Neighborhood</h1>
                </div>
                <StateSelect />
                <RegionSelect />
            </div>
            {obs?.length > 0 && <ViewNav />}
        </header>
    )
}

export default MainHeader;