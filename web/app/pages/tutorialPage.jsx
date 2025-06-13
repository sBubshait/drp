import { useSwipeable } from 'react-swipeable';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function TutorialPage() {
	const navigate = useNavigate();
	const [swipeUp, setSwipeUp] = useState(false);

	const goToArticle = () => {
		setSwipeUp(true);
		setTimeout(() => navigate('/articles/1'), 500);
	};

	const handlers = useSwipeable({
		onSwipedUp: goToArticle,
		onSwipedLeft: goToArticle,
		preventScrollOnSwipe: true,
		trackMouse: true,
	});

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (['ArrowUp', 'ArrowRight', 'Enter'].includes(event.key)) {
				goToArticle();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<div
			{...handlers}
			className={`w-full h-screen flex flex-col items-center justify-between bg-gray-800 p-8 transition-transform duration-500 ${
				swipeUp ? '-translate-y-full' : ''
			}`}
		>
			<header className="text-center mt-4">
				<h1 className="text-4xl font-bold text-white">Welcome To Politico!</h1>
			</header>

			<main className="w-full px-4 py-10 flex flex-col gap-10 bg-gray-200">
				{[
					{ emoji: "📰", text: "Discover Articles from our feed." },
					{ emoji: "🔍", text: "Join discussions and test your understanding." },
					{ emoji: "🪙", text: "Engage to earn XP and keep your streak." },
					{ emoji: "🏆", text: "Compete with friends and climb the leaderboards." }
				].map((item, index) => (
					<section key={index} className="flex items-start gap-4 text-black max-w-2xl mx-auto">
						<div className="text-4xl leading-none min-w-[2.5rem] text-center">{item.emoji}</div>
						<p className="text-ll leading-snug">{item.text}</p>
					</section>
				))}
			</main>

			<footer className="flex flex-col items-center">
				<p className="text-white text-sm text-center">Swipe up to begin!</p>
				<span className="text-2xl mt-3 animate-bounce">↑</span>
			</footer>
		</div>
	);
}
