import { Button, Text, Section } from '@react-email/components';
import * as React from 'react';
import BaseEmail, { DefaultTextStyle, ButtonStyle } from './BaseEmail';

interface PasswordChangeEmailProps {
	name: string;
	url: string;
}

export default function PasswordChangeEmail({ name, url }: PasswordChangeEmailProps) {
	return (
		<BaseEmail 
			previewText="Reset your You Exist password" 
			heading="Password Reset"
			footerText="If you didn't request a password reset, you can safely ignore this email."
		>
			<Text style={DefaultTextStyle.regular}>
				Hey {name}!
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				We received a request to reset your password for your <strong>You Exist</strong> account.
				To complete the password reset process, please click the button below.
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				This link will expire in 24 hours for security reasons.
			</Text>
			<Section style={{ textAlign: 'center', margin: '32px 0' }}>
				<Button
					href={url}
					style={ButtonStyle}
				>
					Reset My Password
				</Button>
			</Section>
			<Text style={DefaultTextStyle.secondary}>
				If you didn't make this request, no action is needed on your part.
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				Cheers,
				<br />
				<br />
				The You Exist Team
			</Text>
		</BaseEmail>
	);
}

PasswordChangeEmail.PreviewProps = {
	name: 'Alex',
	url: 'https://youexist.app/reset-password?token=xyz123'
};
