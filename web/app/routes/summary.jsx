import { SummaryPage } from "../summary/summaryPage.jsx";

export function meta() {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Summary() {
    return <SummaryPage />;
}
