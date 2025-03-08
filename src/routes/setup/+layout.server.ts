import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	console.log('locals', locals);

	if (!locals.user) {
		throw redirect(302, '/');
	}

	// If we're at the root setup path, redirect to the appropriate step
	if (url.pathname === '/setup') {
		console.log('penisadinaiosd');
		// First check if email is verified
		if (locals.user && !locals.user.email_confirmed_at) {
			throw redirect(302, '/setup/verify-email');
		}

		// We'll need to query the database to check which steps are completed
		const { data: person, error } = await locals.supabase
			.from('person')
			.select('preferred_name, country, blurb')
			.eq('id', locals.user.id)
			.single();

		if (error) {
			console.error('Error fetching profile:', error);
			// if there's an error, log the user out
			await locals.supabase.auth.signOut();
			throw redirect(302, '/login');
		}

		if (!person.preferred_name) {
			throw redirect(302, '/setup/name');
		}

		if (!person.country) {
			throw redirect(302, '/setup/origin');
		}

		if (!person.blurb) {
			throw redirect(302, '/setup/blurb');
		}

		// If all steps are completed, redirect to the main app
		throw redirect(302, '/');
	}

	return {
		user: locals.user
	};
};
