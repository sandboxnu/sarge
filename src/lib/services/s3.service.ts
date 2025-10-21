import { S3Client } from '@aws-sdk/client-s3';

class S3Service {
    private client: S3Client;
    private bucket: string;

    constructor() {
        this.client = new S3Client({
            region: 'us-east-2',
        });
    }
}

const s3Service = new S3Service();

export default s3Service;
