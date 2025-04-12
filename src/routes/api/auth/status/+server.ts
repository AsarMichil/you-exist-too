import { json } from '@sveltejs/kit';

export async function GET({ locals: { safeGetSession } }) {
	const { user } = await safeGetSession();

	return json({
		isLoggedIn: !!user
	});
}
