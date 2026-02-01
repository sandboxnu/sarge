import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

class SESConnector {
    private client: SESClient;

    constructor() {
        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

        if (!region || !accessKeyId || !secretAccessKey) {
            throw new Error('Missing required AWS SES environment variables');
        }

        this.client = new SESClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async sendEmail(to: string, from: string, subject: string, body: string): Promise<boolean> {
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
            const res = await this.client.send(new SendEmailCommand(params));
            return res.MessageId ? true : false;
        } catch (error) {
            throw error;
        }
    }
}

const sesConnector = new SESConnector();
export default sesConnector;
