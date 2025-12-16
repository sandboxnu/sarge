import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import { handleError } from '@/lib/utils/errors.utils';

class SecretsConnector {
    private client: SecretsManager;
    private secretName: string;

    constructor() {
        this.client = new SecretsManager({
            region: 'us-east-2',
        });
        this.secretName = process.env.AWS_SECRET_NAME ?? '';
    }

    async getSecretValue(secret: string): Promise<string | null | undefined> {
        try {
            const data = await this.client.getSecretValue({
                SecretId: this.secretName,
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

            return null;
        } catch (error) {
            handleError(error);
        }
    }
}

const secretsConnector = new SecretsConnector();
export default secretsConnector;
