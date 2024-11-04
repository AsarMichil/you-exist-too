import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const underConstruction = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
export const load: PageServerLoad = async () => {
	if (!underConstruction) {
		return redirect(301, '/');
	}
};
