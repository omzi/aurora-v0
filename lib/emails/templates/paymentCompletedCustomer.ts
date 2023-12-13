import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';

interface EmailVariables {
	invoiceLink: string;
	invoiceId: string;
	customerName: string;
	email: string;
}

const paymentCompletedCustomerEmailTemplate = (variables: EmailVariables): string => {
	try {
		const templatePath = path.resolve(process.cwd(), 'lib/emails/templates/paymentCompletedCustomer.handlebars');
		const template = fs.readFileSync(templatePath, 'utf8');
		const compiledTemplate = handlebars.compile(template);
		const compiledHTML = compiledTemplate(variables);

		return compiledHTML;
	} catch (error) {
		console.error('Error compiling email template [paymentCompletedCustomer]:>>', error);
		return '';
	}
};

export default paymentCompletedCustomerEmailTemplate;
