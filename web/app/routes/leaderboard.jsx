import { LeaderboardPage } from "../pages/leaderboardPage";

export function meta() {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Leaderboard() {

    return (<LeaderboardPage />);
}