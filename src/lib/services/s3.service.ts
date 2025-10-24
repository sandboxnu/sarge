import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

export type UploadType = 'user' | 'organization';

const EXTENSIONS: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
};

class S3Service {
    private client: S3Client;
    private bucket: string;

    constructor() {
        this.client = new S3Client({
            region: 'us-east-2',
        });
        this.bucket = process.env.AWS_BUCKET_NAME ?? '';
    }

    async getSignedURL(
        type: UploadType,
        id: string,
        mime: string
    ): Promise<{ signedURL: string; mime: string; key: string }> {
        if (!EXTENSIONS[mime]) throw new Error(`Unsupported MIME type: ${mime}`);
        const ext = EXTENSIONS[mime];

        const key = `${type}/${id}/${randomUUID()}.${ext}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: mime,
        });

        const signedURL = await getSignedUrl(this.client, command, { expiresIn: 15 * 60 });

        return { signedURL, mime, key };
    }
}

const s3Service = new S3Service();

export default s3Service;
