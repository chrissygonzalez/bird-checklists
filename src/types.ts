export type EbirdRegion = {
    name: string;
    code: string;
}

export type SelectedState = {
    selectedState: string;
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