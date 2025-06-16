import { ArticlePageRewrite } from "../pages/articlePageRewrite";

export function meta() {
    return [
        { title: "Article Summary" },
        { name: "description", content: "Read the article and test your understanding" },
    ];
}

export default function ArticleWithId() {
    return <ArticlePageRewrite />;
}