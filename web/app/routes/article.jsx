import { ArticlePage } from "../article/articlePage";

export function meta() {
    return [
        { title: "Article Summary - Climate Change" },
        { name: "description", content: "Read about climate change and test your understanding" },
    ];
}

export default function Article() {
    return <ArticlePage />;
}