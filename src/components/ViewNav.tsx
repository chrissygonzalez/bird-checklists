import { useContext } from 'react';
import { BirdContext, BirdDispatchContext, BirdContextType, BirdActionEnum } from './BirdContext';
import { ViewTypes } from '../types';

const ViewNav = () => {
    const dispatch = useContext(BirdDispatchContext);
    const { viewType } = useContext(BirdContext) as BirdContextType;

    return (
        <nav className="view-nav">
            <div className="obs-desc-container">
            </div>
            <div className="flex icon-button-container">
                <p className="langar-regular icon-button-label">View by:</p>
                <button aria-label="View by date"
                    className={viewType === ViewTypes.DATE ? 'selected icon-btn' : 'icon-btn'}
                    onClick={() => dispatch({ type: BirdActionEnum.SET_VIEW_TYPE, payload: ViewTypes.DATE })}>
                    <span className="material-symbols-outlined icon">
                        calendar_month
                    </span></button>
                <button aria-label="View by bird name"
                    className={viewType === ViewTypes.BIRD ? 'selected icon-btn' : 'icon-btn'}
                    onClick={() => dispatch({ type: BirdActionEnum.SET_VIEW_TYPE, payload: ViewTypes.BIRD })}>
                    <span className="material-symbols-outlined icon">
                        match_case
                    </span>
                </button>
                <button aria-label="View by location"
                    className={viewType === ViewTypes.LOCATION ? 'selected icon-btn' : 'icon-btn'}
                    onClick={() => dispatch({ type: BirdActionEnum.SET_VIEW_TYPE, payload: ViewTypes.LOCATION })}>
                    <span className="material-symbols-outlined icon">
                        distance
                    </span>
                </button>
            </div>
        </nav>
    )
}

export default ViewNav;