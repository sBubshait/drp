import { DiscussionsPage } from "../pages/discussions";
import { DiscussionResultsPage } from "../pages/DiscussionResults"

export function meta() {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Discussions() {
    return <DiscussionResultsPage />;
}