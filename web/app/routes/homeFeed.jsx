import Feed from "../article/feed";

export function meta() {
  return [
    { title: "News feed" },
    { name: "description", content: "Learn about the latest news!" },
  ];
}

export default function HomeFeed() {

    return <Feed />
}

