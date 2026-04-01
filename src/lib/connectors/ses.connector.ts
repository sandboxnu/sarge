import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

interface EmailOptions {
    html?: string;
}

interface MessageBody {
    Text: {
        Data: string;
    };
    Html?: {
        Data: string;
    };
}

class SESConnector {
    private client: SESClient;

    constructor() {
        // Use the SDK's default credential/provider chain.
        this.client = new SESClient({ region: 'us-east-2' });
    }

    async sendEmail(
        to: string,
        subject: string,
        body: string,
        options?: EmailOptions
    ): Promise<boolean> {
        try {
            const bodyConfig: MessageBody = {
                Text: {
                    Data: body,
                },
            };

            if (options?.html) {
                bodyConfig.Html = {
                    Data: options.html,
                };
            }

            const params = {
                Source: `no-reply@${process.env.EMAIL_DOMAIN}`,
                Destination: {
                    ToAddresses: [to],
                },
                Message: {
                    Subject: {
                        Data: subject,
                    },
                    Body: bodyConfig,
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
