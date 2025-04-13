import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Heading,
	Hr,
	Preview
} from '@react-email/components';
import * as React from 'react';

interface BaseEmailProps {
	previewText: string;
	heading: string;
	children: React.ReactNode;
	footerText?: string;
}

export default function BaseEmail({
	previewText,
	heading,
	children,
	footerText
}: BaseEmailProps) {
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
				<Preview>{previewText}</Preview>
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
							{heading}
						</Heading>
						<Hr
							style={{
								borderColor: '#e5e7eb',
								margin: '24px 0'
							}}
						/>
						{children}
						{footerText && (
							<Text
								style={{
									color: '#6b7280',
									fontSize: '14px',
									margin: '32px 0 0'
								}}
							>
								{footerText}
							</Text>
						)}
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

export const DefaultTextStyle = {
	regular: {
		color: '#374151',
		fontSize: '16px',
		lineHeight: '1.5',
		margin: '16px 0'
	},
	secondary: {
		color: '#4b5563',
		fontSize: '16px',
		lineHeight: '1.5',
		margin: '16px 0'
	},
	small: {
		color: '#4b5563',
		fontSize: '12px',
		lineHeight: '1.5',
		margin: '16px 0 24px'
	}
};

export const ButtonStyle = {
	backgroundColor: '#000000',
	borderRadius: '6px',
	color: '#ffffff',
	display: 'inline-block',
	fontSize: '16px',
	fontWeight: '600',
	padding: '12px 24px',
	textDecoration: 'none',
	textTransform: 'none' as const
}; 