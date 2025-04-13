import { Button, Text, Section, Link } from '@react-email/components';
import * as React from 'react';
import BaseEmail, { DefaultTextStyle, ButtonStyle } from './BaseEmail';

interface InviteEmailProps {
	name: string;
	url: string;
	baseUrl: string;
	thinker?: string;
	alreadyExists?: boolean;
}

export default function InviteEmail({
	name,
	url,
	baseUrl,
	thinker,
	alreadyExists
}: InviteEmailProps) {
	const footerText = `This email was sent on behalf of ${thinker ?? 'someone that knows you'}. If you didn't expect this invitation, you can safely ignore this email.`;
	
	return (
		<BaseEmail 
			previewText={`You Exist Invitation on behalf of ${thinker ?? 'someone that knows you'}`}
			heading="You Exist."
			footerText={footerText}
		>
			<Text style={DefaultTextStyle.regular}>
				Hey {name}!
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				Looks like{' '}
				{thinker ? <Link href={baseUrl + '/' + thinker}>{thinker} </Link> : 'someone '}
				thought about you! You've been invited to join <strong>You Exist</strong> - a place
				where thoughts exist for longer than a moment.
			</Text>
			<Text style={DefaultTextStyle.secondary}>
				Create an account so you can start counting the number of times you're thought about.
			</Text>
			<Text style={DefaultTextStyle.small}>
				And as a small bonus, you can see other people's profiles too!
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
					Create My Account
				</Button>
			</Section>
		</BaseEmail>
	);
}

InviteEmail.PreviewProps = {
	name: 'Alex',
	url: 'https://michils.com/signup',
	baseUrl: 'https://michils.com',
	alreadyExists: false
	// thinker: 'John'
};
