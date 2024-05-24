import { Observation } from './types';

export const formatDate = (date: string) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, dateOptions);
}

export const formatDateNav = (date: string) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, dateOptions);
}

export const getSpeciesMap = (data: Observation[]): Map<any, any> => {
    const sMap = new Map();
    for (const species of data) {
        if (!sMap.has(species.speciesCode)) {
            sMap.set(species.speciesCode, species.comName);
        }
    }
    return sMap;
}

export const getLocationMap = (data: Observation[]): Map<any, any> => {
    const lMap = new Map();
    for (const location of data) {
        if (!lMap.has(location.locId)) {
            lMap.set(location.locId, location.locName);
        }
    }
    return lMap;
}