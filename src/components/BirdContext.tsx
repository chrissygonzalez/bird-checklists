import { useState, createContext } from "react";

export type BirdContextType = {
    selectedLocation: string;
    setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
    viewType: string;
    setViewType: React.Dispatch<React.SetStateAction<string>>;
}

export const BirdContext = createContext<BirdContextType | null>(null);

export const BirdProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [viewType, setViewType] = useState('date');

    return (
        <BirdContext.Provider value={{ selectedLocation, setSelectedLocation, viewType, setViewType }}>
            {children}
        </BirdContext.Provider>
    );
};