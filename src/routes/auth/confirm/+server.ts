import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const token_hash = url.searchParams.get('token_hash') as string;
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = url.searchParams.get('next');
	const redirect_to = url.searchParams.get('redirect_to') ?? '/';

	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({ token_hash, type });
		if (!error) {
			return redirect(303, next ?? redirect_to);
		}
	}

	// return the user to an error page with some instructions
	throw redirect(303, '/auth/auth-code-error');
};
