import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { handleError } from '@/lib/utils/errors.utils';

class SESConnector {
    private client: SESClient;

    constructor() {
        this.client = new SESClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    async sendEmail(to: string, from: string, subject: string, body: string): Promise<void> {
        try {
            const params = {
                Source: from,
                Destination: {
                    ToAddresses: [to],
                },
                Message: {
                    Subject: {
                        Data: subject,
                    },
                    Body: {
                        Text: {
                            Data: body,
                        },
                    },
                },
            };
            const data = await this.client.send(new SendEmailCommand(params));
            console.log('Email sent successfully:', data);
        } catch (error) {
            handleError(error);
        }
    }
}

const sesConnector = new SESConnector();
export default sesConnector;
