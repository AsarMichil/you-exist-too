import {
	Button,
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Heading,
	Hr,
	Link,
	Img,
	Preview
} from '@react-email/components';
import * as React from 'react';

export default function Email({
	name,
	url,
	baseUrl,
	thinker
}: {
	name: string;
	url: string;
	baseUrl: string;
	thinker?: string;
	alreadyExists?: boolean;
}) {
	return (
		<Html>
			<Head />
			<Body
				style={{
					backgroundColor: '#f6f9fc',
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
					padding: '0'
				}}
			>
				<Preview>You Exist Invitation on behalf of {thinker ?? 'someone that knows you'}</Preview>
				<Container
					style={{
						margin: '0 auto',
						maxWidth: '600px',
						padding: '20px 0'
					}}
				>
					<Section
						style={{
							backgroundColor: '#ffffff',
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
							marginBottom: '20px',
							padding: '40px'
						}}
					>
						<Heading
							style={{
								color: '#111827',
								fontSize: '30px',
								fontWeight: '700',
								margin: '0 0 20px',
								textAlign: 'center'
							}}
						>
							You Exist.
						</Heading>
						<Hr
							style={{
								borderColor: '#e5e7eb',
								margin: '24px 0'
							}}
						/>
						<Text
							style={{
								color: '#374151',
								fontSize: '16px',
								lineHeight: '1.5',
								margin: '16px 0'
							}}
						>
							Hey {name}!
						</Text>
						<Text
							style={{
								color: '#4b5563',
								fontSize: '16px',
								lineHeight: '1.5',
								margin: '16px 0'
							}}
						>
							Looks like{' '}
							{thinker ? <Link href={baseUrl + '/' + thinker}>{thinker} </Link> : 'someone '}
							thought about you! You've been invited to join <strong>You Exist</strong> - a place
							where thoughts exist for longer than a moment.
						</Text>
						<Text
							style={{
								color: '#4b5563',
								fontSize: '16px',
								lineHeight: '1.5',
								margin: '16px 0 24px'
							}}
						>
							Create an account so you can start counting the number of times you're thought about.
						</Text>
						<Text
							style={{
								color: '#4b5563',
								fontSize: '12px',
								lineHeight: '1.5',
								margin: '16px 0 24px'
							}}
						>
							And as a small bonus, you can see other people's profiles too!
						</Text>
						<Text
							style={{
								color: '#4b5563',
								fontSize: '16px',
								lineHeight: '1.5',
								margin: '16px 0 24px'
							}}
						>
							Cheers,
							<br />
							<br />
							Asar Zuluev
						</Text>
						<Section style={{ textAlign: 'center', margin: '32px 0' }}>
							<Button
								href={url}
								style={{
									backgroundColor: '#000000',
									borderRadius: '6px',
									color: '#ffffff',
									display: 'inline-block',
									fontSize: '16px',
									fontWeight: '600',
									padding: '12px 24px',
									textDecoration: 'none',
									textTransform: 'none'
								}}
							>
								Create My Account
							</Button>
						</Section>
						<Text
							style={{
								color: '#6b7280',
								fontSize: '14px',
								margin: '32px 0 0'
							}}
						>
							This email was sent on behalf of {thinker ?? 'someone that knows you'}. If you didn't
							expect this invitation, you can safely ignore this email.
						</Text>
					</Section>
					<Text
						style={{
							color: '#6b7280',
							fontSize: '12px',
							margin: '24px 0',
							textAlign: 'center'
						}}
					>
						© {new Date().getFullYear()} You Exist. All rights reserved.
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

Email.PreviewProps = {
	name: 'Alex',
	url: 'https://michils.com/signup',
	baseUrl: 'https://michils.com',
	alreadyExists: false
	// thinker: 'John'
};
