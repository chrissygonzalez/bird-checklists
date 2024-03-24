import useFetch from "../hooks/useFetch";

type Observation = {
    howManyStr: string;
    speciesCode: string;
}

type ChecklistDetail = {
    obs: Observation[];
}

const ChecklistDetail = ({ subId }: { subId: string }) => {
    const { data: checklistDetail }: { data: ChecklistDetail } = useFetch(`https://api.ebird.org/v2/product/checklist/view/${subId}`);

    return (
        <div>{checklistDetail?.obs?.map(({ howManyStr, speciesCode }) => <p key={speciesCode}>{speciesCode}: {howManyStr}</p>)}</div>
    )
}

export default ChecklistDetail;