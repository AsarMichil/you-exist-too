import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
const allowedPaths = import.meta.env.VITE_MAINTENANCE_ALLOWED_PATHS?.split(',') || [];
const maintenanceAllowedPaths = ['/sorry'];
if (maintenanceMode && allowedPaths.length > 0) {
	maintenanceAllowedPaths.push(...allowedPaths);
}

export const load: LayoutServerLoad = async ({ route, locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();
	if (maintenanceMode && route.id && !maintenanceAllowedPaths.includes(route.id)) {
		return redirect(302, '/sorry');
	}
	return {
		session,
		cookies: cookies.getAll()
	};
};
