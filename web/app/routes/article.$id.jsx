import { ArticlePage } from "../article/articlePage";

export function meta() {
    return [
        { title: "Article Summary" },
        { name: "description", content: "Read the article and test your understanding" },
    ];
}

export default function ArticleWithId() {
    return <ArticlePage />;
}