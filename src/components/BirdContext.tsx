import { useState, useEffect, createContext } from "react";
import useFetch from "../hooks/useFetch";
import { EbirdRegion } from "../types";

export type BirdContextType = {
    regions: EbirdRegion[];
    setRegions: React.Dispatch<React.SetStateAction<EbirdRegion[]>>;
    selectedState: string;
    setSelectedState: React.Dispatch<React.SetStateAction<string>>;
    selectedStateName: string;
    setSelectedStateName: React.Dispatch<React.SetStateAction<string>>;
    selectedRegion: string;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
    selectedLocation: string;
    setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
    viewType: string;
    setViewType: React.Dispatch<React.SetStateAction<string>>;
    states: EbirdRegion[];
    statesLoading: boolean;
    error: string | null;
}

export const BirdContext = createContext<BirdContextType | null>(null);

export const BirdProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: states, isLoading: statesLoading, error } = useFetch("https://api.ebird.org/v2/ref/region/list/subnational1/US");
    const [selectedState, setSelectedState] = useState(localStorage.getItem('selectedState') || '');
    const [selectedStateName, setSelectedStateName] = useState(localStorage.getItem('selectedStateName') || '');
    const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem('selectedRegion') || '');
    const [regions, setRegions] = useState<EbirdRegion[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [viewType, setViewType] = useState('date');

    const value = {
        regions,
        setRegions,
        selectedState,
        setSelectedState,
        selectedStateName,
        setSelectedStateName,
        selectedRegion,
        setSelectedRegion,
        selectedLocation,
        setSelectedLocation,
        viewType,
        setViewType,
        states,
        statesLoading,
        error
    };
    return (
        <BirdContext.Provider value={value}>
            {children}
        </BirdContext.Provider>
    );
};