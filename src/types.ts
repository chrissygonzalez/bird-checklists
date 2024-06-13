export type EbirdRegion = {
    name: string;
    code: string;
}

export type Observation = {
    howMany: number;
    subId: string;
    speciesCode: string;
    comName: string;
    locId: string;
    locName: string;
    obsDt: string;
    sciName: string;
    lat: string;
    lng: string;
}

export type Location = {
    key: string;
    lat: string;
    lng: string;
    name: string;
}

export type ChecklistObservation = {
    speciesCode: string;
    howManyStr: string;
}

export type Checklist = {
    obsDt: string;
    userDisplayName: string;
    locId: string;
    obs: ChecklistObservation[];
}

export type BirdChecklistType = {
    list: Checklist;
    speciesMap: Map<string, string>;
    locationMap: Map<string, string>;
    setChecklist: React.Dispatch<React.SetStateAction<Checklist | undefined>>;
    onClose: () => void;
}

export enum ViewTypes {
    DATE = 'date',
    BIRD = 'bird',
    LOCATION = 'location',
}