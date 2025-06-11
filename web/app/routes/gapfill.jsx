import GapfillContent from "../components/site_layout/gapFillContent";

export function meta() {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function GapfillPage() {

    return (<GapfillContent />);
}