import { env } from '$env/dynamic/private';
import { client } from '../db';
import ConfirmEmail from './emails/Confirm-Email';
import InviteEmail from './emails/Invite-Email';
import PasswordResetEmail from './emails/PasswordReset-Email';
import { renderAsync } from '@react-email/render';
import type { GenerateLinkParams, GenerateLinkType } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_ONBOARDING_KEY);
const from_address = 'onboarding@youexist.michils.com';
const notification_address = 'notification@youexist.michils.com';
// const support_address = 'support@youexist.michils.com';
// const noreply_address = 'noreply@youexist.michils.com';


export function sendEmailConfirmation(email: string, username: string, link: string) {
	return resend.emails.send({
		from: from_address,
		to: email,
		subject: `Verify your email ${username} | You Exist`,
		react: ConfirmEmail({ name: username, url: link })
	});
}

export function sendPasswordReset(email: string, username: string, link: string) {
	return resend.emails.send({
		from: notification_address,
		to: email,
		subject: `Reset Your Password | You Exist`,
		react: PasswordResetEmail({ name: username, url: link })
	});
}
// TODO handle already exists case
export function sendInviteEmail(
	email: string,
	name: string,
	inviteLink: string,
	baseUrl: string,
	thinker?: string,
	alreadyExists?: boolean
) {
	console.log('Sending invite email to', email, name, inviteLink, baseUrl, thinker);
	return resend.emails.send({
		from: notification_address,
		to: email,
		subject: `You've been invited to join You Exist!`,
		react: InviteEmail({ name, url: inviteLink, baseUrl, thinker, alreadyExists })
	});
}

export async function stealHash(linkParams: GenerateLinkParams) {
	let token_hash = null;
	const { data, error } = await client.auth.admin.generateLink(linkParams);
	if (error) {
		console.error('Error generating link:', error);
		return { data: null, error: error };
	}
	token_hash = data.properties.hashed_token;
	return { data: { token_hash, otp: data.properties.email_otp, user: data.user }, error: null };
}
export interface MagicLinkEmailProps {
	site_url: string;
	email_action_type: GenerateLinkType;
	redirect_to: string;
	token_hash: string;
}

export const generateEmailLink = ({
	site_url,
	email_action_type,
	redirect_to,
	token_hash
}: MagicLinkEmailProps) => {
	return `${site_url}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;
};
