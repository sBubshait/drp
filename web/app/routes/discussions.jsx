import { DiscussionsPage } from "../pages/discussions";

export function meta() {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Discussions() {
    return <DiscussionsPage />;
}