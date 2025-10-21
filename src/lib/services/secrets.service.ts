import { SecretsManager } from '@aws-sdk/client-secrets-manager';

class SecretsService {
    private client: SecretsManager;

    constructor() {
        this.client = new SecretsManager({
            region: 'us-east-2',
        });
    }

    async getSecretValue(secret: string) {
        try {
            const data = await this.client.getSecretValue({
                SecretId: process.env.AWS_SECRET_NAME,
            });

            if (!data?.SecretString && !data.SecretBinary) {
                throw new Error(`Secret ${secret} not found`);
            }

            if (data.SecretString) {
                const secrets = JSON.parse(data.SecretString);
                return secrets[secret];
            }

            if (data.SecretBinary) {
                const bufferBinarySecret = Buffer.from(data.SecretBinary);
                const decodedBinarySecret = bufferBinarySecret.toString('utf8');

                const secrets = JSON.parse(decodedBinarySecret);
                return secrets[secret];
            }
        } catch (error) {
            // TODO: add a secrets parsing error
            throw error;
        }
    }
}

const secretsService = new SecretsService();
export default secretsService;
