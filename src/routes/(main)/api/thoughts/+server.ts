import { db } from '$lib/server/db';
import { Server } from '$lib/server/db/db';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals: { safeGetSession } }) {
	try {
		const { username, isAnonymous = false } = await request.json();

		if (!username) {
			return json({ error: 'Username is required' }, { status: 400 });
		}

		// Get the person being thought about
		const { data: personData, error: personError } = await Server.client
			.from('person')
			.select('id, username')
			.eq('username', username.toLowerCase())
			.single();

		if (personError || !personData) {
			return json({ error: 'Person not found' }, { status: 404 });
		}

		const aboutUsername = personData.username;

		// Check if user is logged in
		const { user } = await safeGetSession();
		let thinkerId = null;

		if (user && !isAnonymous) {
			thinkerId = user.id;
		}

		// Insert thought into the thought table
		const { error: thoughtError } = await Server.client.from('thought').insert({
			about: aboutUsername,
			thinker: thinkerId,
			created_at: new Date().toISOString()
		});

		if (thoughtError) {
			console.error('Error adding thought:', thoughtError);
			return json({ error: 'Failed to add thought' }, { status: 500 });
		}
		// if logged in, increment user's thoughts_thought count
		if (user && !isAnonymous) {
			const { data: thoughtsCount, error: thoughtsCountError } = await Server.client
				.from('person')
				.select('thoughts_thought')
				.eq('id', thinkerId)
				.single();

			// Increment thoughts_thought column in person table
			const { error: updateError } = await Server.client
				.from('person')
				.update({
					thoughts_thought: thoughtsCount?.thoughts_thought ? thoughtsCount.thoughts_thought + 1 : 1
				})
				.eq('id', thinkerId);

			if (updateError) {
				console.error('Error updating thoughts count:', updateError);
				// We still return success since the thought was added
			}
		}

		return json({
			success: true,
			message: 'Thought added successfully'
		});
	} catch (error) {
		console.error('Error processing thought:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
