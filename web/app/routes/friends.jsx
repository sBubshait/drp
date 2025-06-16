import { FriendsPage } from "../pages/friendsPage";

export function meta() {
    return [
        { title: "Friends Page" },
        { name: "description", content: "Connect with friends and explore their activities" },
    ];
}

export default function Friends() {
    return <FriendsPage />;
}