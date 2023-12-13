import axios from 'axios';

import config from '#/lib/config';

interface BrevoEmailRequest {
	sender: { email: string; name: string };
	to: { email: string; name?: string }[];
	subject: string;
	textContent?: string;
	htmlContent?: string;
}

const sendBrevoEmail = async (emailRequest: BrevoEmailRequest): Promise<Boolean> => {
	try {
		const apiUrl = 'https://api.brevo.com/v3/smtp/email';
		const response = await axios.post(apiUrl, emailRequest, {
			headers: {
				'Content-Type': 'application/json',
				'api-key': config.BREVO_API_KEY
			}
		});

		console.log('Email sent successfully :>>', response.data);
		return true;
	} catch (error: any) {
		console.error('Error sending email :>>', error.response?.data || error.message);
		return false;
	}
};

export default sendBrevoEmail;
