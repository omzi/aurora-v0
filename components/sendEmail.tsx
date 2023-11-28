import Plunk from '@plunk/node';
import { render } from '@react-email/render';
import Email from './Email';
import { useUserContext } from './contexts/UserContext';

async function sendEmail({url, receiver, receiverName, busnessName}:{url?: string; receiver?: string, receiverName?: string; busnessName?: string;}) {
    const plunk = new Plunk("sk_69c2d9a0501f6f3a7ab3e44f39f4134477dd47b29a072bfd");
    try {
        const message = `Good day ${receiverName} an ivoice from ${busnessName} bus has been generated, follow this link ${url} to view invoice`
        
      const success = await plunk.emails.send({
            to: receiver as string,
            subject: `Invoice from ${busnessName}`,
            body: message,
        });
        
        return success.success
    } catch (error) {
        console.log('error from mail:', error);
    }
}

export default sendEmail