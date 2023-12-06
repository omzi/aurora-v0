import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

interface EmailVariables {
	invoiceLink: string;
  invoiceId: string;
	businessName: string;
	customerName: string;
	amount: string;
	dueDate: string;
	email: string;
}

const invoiceReceivedEmailTemplate = (variables: EmailVariables): string => {
  try {
		const templatePath = path.resolve(process.cwd(), 'lib/emails/templates/invoiceReceived.handlebars');
    const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(template);
    const compiledHTML = compiledTemplate(variables);

    return compiledHTML;
  } catch (error) {
    console.error('Error compiling email template :>>', error);
    return '';
  }
}

export default invoiceReceivedEmailTemplate;
