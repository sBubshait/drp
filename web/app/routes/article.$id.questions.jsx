import { QuestionPage } from "../pages/questionPage";

export function meta() {
    return [
        { title: "Article Questions" },
        { name: "description", content: "Answer questions about the article" },
    ];
}

export default function ArticleQuestions() {
    return <QuestionPage />;
}