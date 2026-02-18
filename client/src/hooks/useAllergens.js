// client/src/hooks/useAllergens.js

import { useEffect, useState } from 'react';
import { getAllergens } from '../utils/allergenCache';

export function useAllergens() {
	const [allergens, setAllergens] = useState([]);

	useEffect(() => {
		let isMounted = true;

		async function load() {
			const { arr } = await getAllergens();
			if (isMounted) setAllergens(arr);
		}

		load();
		return () => {
			isMounted = false;
		};
	}, []);

	return allergens;
}
