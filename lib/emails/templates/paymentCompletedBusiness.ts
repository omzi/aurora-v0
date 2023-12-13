import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';

interface EmailVariables {
	invoicesPageLink: string;
	invoiceId: string;
	customerName: string;
	email: string;
	businessName: string;
	amount: string;
	paymentDate: string;
}

const paymentCompletedBusinessEmailTemplate = (
	variables: EmailVariables
): string => {
	try {
		const templatePath = path.resolve(process.cwd(), 'lib/emails/templates/paymentCompletedBusiness.handlebars');
		const template = fs.readFileSync(templatePath, 'utf8');
		const compiledTemplate = handlebars.compile(template);
		const compiledHTML = compiledTemplate(variables);

		return compiledHTML;
	} catch (error) {
		console.error('Error compiling email template [paymentCompletedBusiness]:>>', error);
		return '';
	}
};

export default paymentCompletedBusinessEmailTemplate;
