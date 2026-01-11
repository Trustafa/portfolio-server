import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config'; // automatically loads .env


// S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadTestFile() {
  try {
    const filePath = path.join(__dirname, 'test-file.txt'); // any file you want to test
    fs.writeFileSync(filePath, 'Hello S3!'); // create a dummy file

    const fileContent = fs.readFileSync(filePath);
    const s3Key = `test/${Date.now()}-test-file.txt`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'text/plain',
    }));

    console.log(`File uploaded successfully: https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`);

    fs.unlinkSync(filePath); // optional: clean up local file
  } catch (err) {
    console.error('Upload failed:', err);
  }
}

uploadTestFile();
