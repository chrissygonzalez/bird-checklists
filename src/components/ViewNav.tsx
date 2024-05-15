import { formatDate } from "../helpers";

type ViewNav = {
    viewType: string;
    setViewType: (date: string) => void;
    startDate: string;
    endDate: string;
}

const ViewNav = ({ viewType, setViewType, startDate, endDate }: ViewNav) => {
    return (
        <nav>
            <div className="obs-desc-container">
                <p className="obs-desc">Most recent sightings by location ({formatDate(startDate)} – {formatDate(endDate)})</p>
            </div>
            <div className="flex icon-button-container">
                <p className="langar-regular icon-button-label">View by:</p>
                <button aria-label="View by date" className={viewType === 'date' ? 'selected icon-btn' : 'icon-btn'} onClick={() => setViewType('date')}>
                    <span className="material-symbols-outlined icon">
                        calendar_month
                    </span></button>
                <button aria-label="View by bird name" className={viewType === 'bird' ? 'selected icon-btn' : 'icon-btn'} onClick={() => setViewType('bird')}>
                    <span className="material-symbols-outlined icon">
                        match_case
                    </span>
                </button>
                <button aria-label="View by location" className={viewType === 'location' ? 'selected icon-btn' : 'icon-btn'} onClick={() => setViewType('location')}>
                    <span className="material-symbols-outlined icon">
                        distance
                    </span>
                </button>
            </div>
        </nav>
    )
}

export default ViewNav;