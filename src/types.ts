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
    locName: string;
    obsDt: string;
}