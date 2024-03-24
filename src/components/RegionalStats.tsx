import useFetch from "../hooks/useFetch";

type RegionalStats = {
    numChecklists: number;
    numContributors: number;
    numSpecies: number;
}

const RegionalStats = ({ selectedRegion }: { selectedRegion: string }) => {
    const { data: regionalStats }: { data: RegionalStats } = useFetch(`https://api.ebird.org/v2/product/stats/${selectedRegion}/2024/3/21`);
    return (
        <div>
            Checklists: {regionalStats?.numChecklists}
            Contributors: {regionalStats?.numContributors}
            Species: {regionalStats?.numSpecies}
        </div>
    )
}

export default RegionalStats;