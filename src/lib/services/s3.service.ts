import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { mime } from 'zod';

class S3Service {
    private client: S3Client;
    private bucket: string;

    constructor() {
        this.client = new S3Client({
            region: 'us-east-2',
        });
        this.bucket = process.env.AWS_BUCKET_NAME ?? '';
    }

    async generateUploadUrl(
        type: 'user' | 'organization',
        mime: string,
        organizationId?: string,
        userId?: string
    ): Promise<{ uploadURL: string; key: string }> {
        let name;
        if (type === 'organization') {
            if (!organizationId) throw new Error('No organization ID provided');
            name = organizationId;
        } else if (type === 'user') {
            if (!userId) throw new Error('No user ID provided');
            name = userId;
        }

        const key = `${type}/${name}.${mime.split('/')[1] || 'jpg'}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: mime,
            ACL: 'private',
            ServerSideEncryption: 'AES256',
            CacheControl: 'public, max-age=31536000, immutable',
            ContentDisposition: 'inline',
        });

        const uploadURL = await getSignedUrl(this.client, command, { expiresIn: 15 * 60 });

        return { uploadURL, key };
    }
}

const s3Service = new S3Service();

export default s3Service;
