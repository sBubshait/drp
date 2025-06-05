import GapfillContent from "../components/site_layout/gapFillContent";

export function meta() {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function GapfillPage() {

    return (<GapfillContent content={{id: 13, 
        sentenceTemplate: "When Contractionary Monetary Policy is in effect, the base rate ___ whilst the price of bonds ___ .",
        options: ["stable", "increases", "decreases", "Keynesian"],
        correctAnswers: ["increases", "decreases"],
        context: "The PM’s recent contractionary monetary policy has resulted in an increase in the base rate to 7% and seen a massive cute to level of spending. As expected, analysts have predicted a 0.3% drop in general bond prices.",
    }} />);
}