import { client, db } from '$lib/server/db/index.js';
import { generateEmailLink, sendInviteEmail, stealHash } from '$lib/server/email/send-email';
import { isAuthApiError } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

// Define the schema for our invite form
const inviteSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	contactInfo: z
		.string()
		.min(1, 'Email or phone is required')
		.refine(
			(val) => {
				// Check if it's a valid email or phone number
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
				return emailRegex.test(val) || phoneRegex.test(val);
			},
			{ message: 'Please enter a valid email or phone number' }
		),
	sendAnonymously: z.boolean()
});

export const load = async ({ url, locals }) => {
	// Get the person to invite from the URL query parameter
	const personToInvite = url.searchParams.get('q') || '';

	// Create a new form with the schema and initial values
	const form = await superValidate(zod(inviteSchema), {
		defaults: {
			name: personToInvite,
			contactInfo: '',
			sendAnonymously: true
		}
	});

	return { form };
};

export const actions = {
	default: async ({ request, url, locals }) => {
		// log request body
		const form = await superValidate(request, zod(inviteSchema));
		if (!form.valid) {
			console.log('Form is not valid');
			return fail(400, { form });
		}

		// Get the data from the form
		const { name, contactInfo, sendAnonymously } = form.data;
		// Check if contactInfo is an email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(contactInfo)) {
			console.log(`Phone invite to ${name} at ${contactInfo} would be sent here`);
		} else {
			let inviteLink = 'somethingStupid';
			let currentUsername = null;

			// TODO send already exists email
			// Generate magic link
			let token_hash = null;
			const { data, error } = await stealHash({
				type: 'invite',
				email: contactInfo,
				options: {
					redirectTo: `THIS SHIT DO NOT MATTER`
				}
			});
			if (error) {
				if (isAuthApiError(error)) {
					if (error.code === 'email_exists') {
						// return opaque response and say yeah! invited!
						return message(form, 'Invitation sent');
					}
				}
				return fail(500, { form, message: 'Failed to send invitation' });
			}
			token_hash = data.token_hash;

			inviteLink = generateEmailLink({
				site_url: url.origin,
				email_action_type: 'invite',
				redirect_to: `${url.origin}?invited=true&name=${encodeURIComponent(name)}`,
				token_hash
			});
			if (!sendAnonymously) {
				const user = locals.user;
				if (user) {
					const person = await db.getPersonById(user.id);
					if (person.data && person.data.length > 0) {
						currentUsername = person.data[0].username;
					}
				}
			}

			// // Send the invite email
			try {
				await sendInviteEmail(contactInfo, name, inviteLink, url.origin, currentUsername, false);
				console.log('Invite email sent');
			} catch (error) {
				console.error('Error sending invite email:', error);
				return fail(500, { form, message: 'Failed to send invitation' });
			}
		}

		return message(form, 'Invitation sent');
	}
};
