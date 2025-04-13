import { Button, Text, Section } from '@react-email/components';
import * as React from 'react';
import BaseEmail, { DefaultTextStyle, ButtonStyle } from './BaseEmail';

interface ConfirmEmailProps {
	name: string;
	url: string;
}

export default function ConfirmEmail({ name, url }: ConfirmEmailProps) {
	return (
		<BaseEmail 
			previewText="Confirm your You Exist email address" 
			heading="Verify Your Email"
			footerText="If you didn't create an account on You Exist, you can safely ignore this email."
		>
			<Text style={DefaultTextStyle.regular}>
				Hey {name}!
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				Thanks for signing up for <strong>You Exist</strong>! To complete your registration and verify your email address, please click the button below.
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				This link will expire in 24 hours, so please verify your email soon.
			</Text>
			<Section style={{ textAlign: 'center', margin: '32px 0' }}>
				<Button
					href={url}
					style={ButtonStyle}
				>
					Verify My Email
				</Button>
			</Section>
			<Text style={DefaultTextStyle.secondary}>
				Once verified, you'll be able to fully access your account and start receiving notifications when someone thinks about you.
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

ConfirmEmail.PreviewProps = {
	name: 'Alex',
	url: 'https://youexist.app/verify-email?token=abc123'
};
