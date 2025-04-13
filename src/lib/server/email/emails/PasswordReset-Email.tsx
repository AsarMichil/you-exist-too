import { Button, Text, Section } from '@react-email/components';
import * as React from 'react';
import BaseEmail, { DefaultTextStyle, ButtonStyle } from './BaseEmail';

interface PasswordResetEmailProps {
	name: string;
	url: string;
}

export default function PasswordResetEmail({
	name,
	url
}: PasswordResetEmailProps) {
	const footerText = `If you did not request a password reset, you can safely ignore this email.`;
	
	return (
		<BaseEmail 
			previewText="Password reset for your You Exist account"
			heading="Reset Your Password"
			footerText={footerText}
		>
			<Text style={DefaultTextStyle.regular}>
				Hey {name}!
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				You requested a password reset for your You Exist account. Click the button below to reset your password.
			</Text>
			<Text style={DefaultTextStyle.small}>
				This link will expire after 24 hours.
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				Cheers,
				<br />
				<br />
				Asar Zuluev
			</Text>
			<Section style={{ textAlign: 'center', margin: '32px 0' }}>
				<Button
					href={url}
					style={ButtonStyle}
				>
					Reset Password
				</Button>
			</Section>
		</BaseEmail>
	);
}

PasswordResetEmail.PreviewProps = {
	name: 'User',
	url: 'https://youexist.michils.com/auth/password'
}; 