// client/src/hooks/useAccountDetails.js

import getCookie from '../utils/cookies';
import { splitName } from '../utils/splitName';

export default function useAccountDetails() {
	const fullName = getCookie('fullName') || '';
	const email = getCookie('email') || '';

	const [firstName, lastName] = splitName(fullName);

	return { firstName, lastName, email };
}
