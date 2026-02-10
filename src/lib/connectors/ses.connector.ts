import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

class SESConnector {
    private client: SESClient;

    constructor() {
        const region = process.env.AWS_REGION;

        // Use the SDK's default credential/provider chain.
        this.client = new SESClient({ region: 'us-east-2' });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        try {
            const params = {
                Source: `no-reply@${process.env.EMAIL_DOMAIN}`,
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
            const res = await this.client.send(new SendEmailCommand(params));
            return !!res.MessageId;
        } catch (error) {
            throw error;
        }
    }
}

const sesConnector = new SESConnector();
export default sesConnector;
