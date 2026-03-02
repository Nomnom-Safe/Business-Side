import { useState, useEffect } from 'react';
import './SplashScreen.scss';

function SplashScreen() {
	const [exiting, setExiting] = useState(false);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			sessionStorage.setItem('splashSeen', 'true');
			setHidden(true);
			return;
		}

		const t1 = setTimeout(() => setExiting(true), 1800);
		const t2 = setTimeout(() => {
			sessionStorage.setItem('splashSeen', 'true');
			setHidden(true);
		}, 2500);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, []);

	if (hidden) return null;

	return (
		<div className={`splash${exiting ? ' splash--exiting' : ''}`}>
			<div className="splash__content">
				<h1 className="splash__title">NomNom Safe</h1>
				<p className="splash__tagline">Food allergy management, simplified.</p>
			</div>
		</div>
	);
}

export default SplashScreen;
