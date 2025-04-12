import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		// TODO log the user in
		console.log('event', request);
		const formData = await request.formData();
		console.log('formData', formData);
		return fail(400, { error: 'Not implemented' });
	}
} satisfies Actions;
