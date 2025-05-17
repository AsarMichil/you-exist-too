import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		await supabase.auth.signOut();
	}
	return redirect(302, '/');
};
