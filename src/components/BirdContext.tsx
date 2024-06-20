import { useEffect, createContext, useReducer, Dispatch } from "react";
import { EbirdRegion, Observation } from "../types";
import { getBirdMap, getLocationMap, getSpeciesMap } from "../helpers";

export type BirdContextType = {
    states: EbirdRegion[];
    regions: EbirdRegion[];
    obs: Observation[];
    hasObs: boolean;
    locationMap: Map<string, string>;
    speciesMap: Map<string, string>;
    birdMap: Map<string, Map<string, Observation[]>>;
    selectedState: string;
    selectedStateName: string;
    selectedRegion: string;
    selectedLocation: string;
    viewType: string;
    isLoading: boolean;
    error: string | null;
}

const emptyMap: Map<string, string> = new Map();
emptyMap.set('', '');

const emptyBirdMapItem: Map<string, Observation[]> = new Map();
const emptyBirdMap: Map<string, Map<string, Observation[]>> = new Map();
emptyBirdMap.set('', emptyBirdMapItem);

const initialState = {
    states: [],
    regions: [],
    obs: [],
    hasObs: false,
    locationMap: emptyMap,
    speciesMap: emptyMap,
    birdMap: emptyBirdMap,
    viewType: 'date',
    selectedState: localStorage.getItem('selectedState') || '',
    selectedStateName: localStorage.getItem('selectedStateName') || '',
    selectedRegion: localStorage.getItem('selectedRegion') || '',
    selectedLocation: '',
    isLoading: false,
    error: '',
}

export const BirdContext = createContext<BirdContextType>(initialState);
export const BirdDispatchContext = createContext<Dispatch<any>>({} as Dispatch<any>);

export const BirdProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer<(state: BirdContextType, actions: BirdAction) => BirdContextType>(
        birdReducer,
        initialState
    );

    const myHeaders = new Headers();
    myHeaders.append("X-eBirdApiToken", `${import.meta.env.VITE_EBIRD_KEY}`);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    useEffect(() => {
        fetch('https://api.ebird.org/v2/ref/region/list/subnational1/US', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw Error('could not fetch the data for that resource');
                }
                return response.json();
            })
            .then(data => {
                dispatch({
                    type: BirdActionEnum.INITIALIZE_STATES,
                    payload: data,
                });
            });
    }, []);

    return (
        <BirdContext.Provider value={state}>
            <BirdDispatchContext.Provider value={dispatch}>
                {children}
            </BirdDispatchContext.Provider>
        </BirdContext.Provider>
    );
};

export enum BirdActionEnum {
    INITIALIZE_STATES = 'INITIALIZE_STATES',
    INITIALIZE_REGIONS = 'INITIALIZE_REGIONS',
    SELECT_STATE = 'SELECT_STATE',
    SELECT_REGION = 'SELECT_REGION',
    SELECT_LOCATION = 'SELECT_LOCATION',
    SET_OBSERVATIONS = 'SET_OBSERVATIONS',
    SET_LOADING = 'SET_LOADING',
    SET_VIEW_TYPE = 'SET_VIEW_TYPE',
    SET_ERROR = 'SET_ERROR',
    CLEAR_STATE = 'CLEAR_STATE',
    CLEAR_SELECTED_LOCATION = 'CLEAR_SELECTED_LOCATION',
}

type BirdAction = {
    type: BirdActionEnum,
    payload: any,
}

function birdReducer(state: BirdContextType, action: BirdAction) {
    switch (action.type) {
        case BirdActionEnum.INITIALIZE_STATES: {
            return { ...state, states: action.payload, isLoading: false, error: '', obs: [], hasObs: false, };
        }
        case BirdActionEnum.INITIALIZE_REGIONS: {
            return { ...state, regions: action.payload, isLoading: false, error: '', obs: [], hasObs: false, };
        }
        case BirdActionEnum.SET_LOADING: {
            return { ...state, isLoading: action.payload };
        }
        case BirdActionEnum.SELECT_STATE: {
            const selectedState = action.payload;
            const selectedStateName = state.states.find((state: EbirdRegion) => state.code === selectedState)?.name || '';
            localStorage.setItem('selectedState', selectedState);
            localStorage.setItem('selectedStateName', selectedStateName);
            return { ...state, selectedState, selectedStateName, obs: [] };
        }
        case BirdActionEnum.SELECT_REGION: {
            localStorage.setItem('selectedRegion', action.payload);
            return { ...state, selectedRegion: action.payload, obs: [], hasObs: false };
        }
        case BirdActionEnum.SELECT_LOCATION: {
            return { ...state, selectedLocation: action.payload };
        }
        case BirdActionEnum.SET_OBSERVATIONS: {
            const locationMap = getLocationMap(action.payload);
            const speciesMap = getSpeciesMap(action.payload);
            const birdMap = getBirdMap(action.payload);
            return { ...state, isLoading: false, error: '', obs: action.payload, hasObs: true, locationMap, speciesMap, birdMap };
        }
        case BirdActionEnum.SET_VIEW_TYPE: {
            return { ...state, viewType: action.payload };
        }
        case BirdActionEnum.SET_ERROR: {
            return { ...state, isLoading: false, error: 'could not fetch the data for that resource' };
        }
        case BirdActionEnum.CLEAR_SELECTED_LOCATION: {
            return { ...state, selectedLocation: '' };
        }
        case BirdActionEnum.CLEAR_STATE: {
            localStorage.setItem('selectedState', '');
            localStorage.setItem('selectedRegion', '');
            localStorage.setItem('selectedStateName', '');
            return { ...state, regions: [], selectedState: '', selectedStateName: '', selectedRegion: '', obs: [], hasObs: false, };
        }
        default: {
            return state;
        }
    }
}