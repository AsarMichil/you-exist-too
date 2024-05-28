import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_ONBOARDING_KEY);
const from_address = 'onboarding@youexist.michils.com';
const notification_address = 'notification@youexist.michils.com';
const support_address = 'support@youexist.michils.com';
const noreply_address = 'noreply@youexist.michils.com';

export function sendVerificationEmail(email: string, username: string, code: string) {
	return resend.emails.send({
		from: from_address,
		to: email,
		subject: `Verify your email ${username}`,
		html: `<p>Hey! ${username}<br>Thanks for signing up for You Exist.<br>Verify your email address to continue registration!</p>
		<div>Your code is:<br>${code}<br><br></div>
		<div>Thanks,</div>
		<div>
		<br />- Asar</div>`
	});
}

export function sendSignupLink(email: string, username: string, link: string) {
	return resend.emails.send({
		from: from_address,
		to: email,
		subject: `Verify your email ${username}`,
		html: `<p>Hey! ${username}<br>Thanks for signing up for You Exist.<br>Click the link to register!</p>
		<div>Your link is:<br>
		<a href="${link}">Here!</a><br>
		<br>
		</div>
		<div>Thanks,</div>
		<div>
		<br />- Asar</div>`
	});
}

export function sendPasswordReset(email: string, username: string, link: string) {
	return resend.emails.send({
		from: notification_address,
		to: email,
		subject: `You Exist: Password Reset Request For Your Account`,
		html: `<p>Hey! <br>You requested a password reset link<br>Click the link to reset your password!</p>
		<div>Your link is:<br>
		<a href="${link}">Here!</a><br>
		<br>
		<div>Do not share this link with anyone!</div>
		</div>
		<div>Thanks,</div>
		<div>
		<br />- Asar</div>
		<div>
		<br /><br />
		If you did not request this, feel free to ignore this email.</div>
		`
	});
}
