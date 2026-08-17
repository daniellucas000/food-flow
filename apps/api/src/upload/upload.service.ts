import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor() {
    const namespace = process.env.OCI_NAMESPACE!;
    const region = process.env.OCI_REGION!;
    this.bucket = process.env.OCI_BUCKET!;

    this.s3 = new S3Client({
      region,
      endpoint: `https://${namespace}.compat.objectstorage.${region}.oraclecloud.com`,
      credentials: {
        accessKeyId: process.env.OCI_ACCESS_KEY!,
        secretAccessKey: process.env.OCI_SECRET_KEY!,
      },
      forcePathStyle: true,
    });

    this.publicBaseUrl = `https://${namespace}.objectstorage.${region}.oci.customer-oci.com/n/${namespace}/b/${this.bucket}/o`;
  }

  async uploadImage(
    file: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<string> {
    const extension = originalName.split('.').pop();
    const key = `${randomUUID()}.${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );

    return `${this.publicBaseUrl}/${key}`;
  }
}
