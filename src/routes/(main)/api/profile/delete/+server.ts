import { client } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals: { safeGetSession, supabase } }) {
	const { user } = await safeGetSession();
	if (!user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { data, error } = await client.from('person').delete().eq('id', user.id);
	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	const { error: deleteError } = await client.auth.admin.deleteUser(user.id, false);
	if (deleteError) {
		// real bad
		// TODO maybe transaction needed here...
		return json({ error: deleteError.message }, { status: 500 });
	}

	await supabase.auth.signOut();

	return json({ message: 'Profile deleted' }, { status: 200 });
}
