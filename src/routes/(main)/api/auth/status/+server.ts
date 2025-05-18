import { client, db } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET({ locals: { safeGetSession } }) {
	const { user } = await safeGetSession();
	let username = null;
	if (user) {
		const { data: userData } = await client
			.from('person')
			.select('username')
			.eq('id', user.id)
			.single();
		username = userData?.username as string | null;
	}
	return json({
		isLoggedIn: !!user,
		username
	});
}
