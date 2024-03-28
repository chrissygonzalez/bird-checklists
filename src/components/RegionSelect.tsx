import useFetch from "../hooks/useFetch";
import { EbirdRegion } from "../types";

type RegionSelect = {
    selectedState: string;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
}

const RegionSelect = ({ selectedState, setSelectedRegion }: RegionSelect) => {
    const { data: regions } = useFetch(`https://api.ebird.org/v2/ref/region/list/subnational2/${selectedState}`);

    return (
        <>
            <select id="ebirdRegions" onChange={e => {
                setSelectedRegion(e.target.value);
            }}>
                <option value={''}>Choose a region</option>
                {regions?.map((st: EbirdRegion) => <option key={st.code} value={st.code}>{st.name}</option>)}
            </select>
        </>
    )
}

export default RegionSelect;