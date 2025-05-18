import { Server } from '$lib/server/db/db';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const username = url.searchParams.get('username');

	if (!username) {
		return json({ error: 'Username is required' }, { status: 400 });
	}

	try {
		console.log('username', username);
		// Get the person ID
		const { data: personData, error: personError } = await Server.client
			.from('thought')
			.select('*', { count: 'exact', head: true })
			.eq('about', username.toLowerCase());

		console.log(personData);
		if (personError || !personData) {
			return json({ error: 'Person not found' }, { status: 404 });
		}

		// Return the thoughts_thought count
		return json({
			count: personData[0].count || 0
		});
	} catch (error) {
		console.error('Error fetching thought count:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
