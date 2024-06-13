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

export const getSpeciesMap = (data: Observation[]): Map<string, string> => {
    const sMap = new Map();
    for (const species of data) {
        if (!sMap.has(species.speciesCode)) {
            sMap.set(species.speciesCode, species.comName);
        }
    }
    return sMap;
}

export const getLocationMap = (data: Observation[]): Map<string, string> => {
    const lMap = new Map();
    for (const location of data) {
        if (!lMap.has(location.locId)) {
            lMap.set(location.locId, location.locName);
        }
    }
    return lMap;
}

export const getBirdMap = (birds: Observation[]) => {
    const birdMap: Map<string, Map<string, Observation[]>> = new Map();
    for (const ob of birds) {
        const day = new Date(ob['obsDt']).toLocaleDateString();
        const location = ob['locName'];

        if (birdMap.has(day)) {
            const birdDate = birdMap.get(String(day));

            if (birdDate?.has(location)) {
                const birdDateLoc = birdDate.get(String(location));
                birdDateLoc?.push(ob);
            } else {
                birdDate?.set(String(location), [ob]);
            }
        } else {
            const birdDateLoc = new Map();
            birdDateLoc.set(String(location), [ob]);
            birdMap.set(String(day), birdDateLoc);
        }
    }
    return birdMap;
}