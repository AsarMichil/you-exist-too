import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const underConstruction = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
export const load: PageServerLoad = async () => {
	if (!underConstruction) {
		return redirect(301, '/');
	}
};
