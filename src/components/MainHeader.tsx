import { useContext } from 'react';
import RegionSelect from './RegionSelect';
import StateSelect from "./StateSelect";
import ViewNav from "./ViewNav";
import { BirdDispatchContext, BirdActionEnum, BirdContext, BirdContextType } from './BirdContext';
import BirdLogo from './BirdLogo';

const MainHeader = () => {
    const dispatch = useContext(BirdDispatchContext);
    const { hasObs } = useContext(BirdContext) as BirdContextType;

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
            {hasObs && <ViewNav />}
        </header>
    )
}

export default MainHeader;