import { EbirdRegion } from "../types";

type RegionSelect = {
    regions: EbirdRegion[];
    selectedRegion: string;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
}

const RegionSelect = ({ regions, selectedRegion, setSelectedRegion }: RegionSelect) => {
    return (
        <select id="ebirdRegions" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value={''}>Choose a region</option>
            {regions?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
        </select>
    )
}

export default RegionSelect;