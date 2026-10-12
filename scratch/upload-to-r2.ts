import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || 'auto',
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
    secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
  },
});

const BUCKET = process.env.STORAGE_BUCKET || 'wegen-media';

async function uploadSampleFiles() {
  console.log(`📡 Connecting to Cloudflare R2 bucket: ${BUCKET}...`);

  // 1. Upload a sample campaign cover image
  const imageSample = Buffer.from('WeGen Campaign High-Res Photo Asset Demo', 'utf-8');
  const imageKey = 'public/campaigns/chala_cardiac_surgery_cover.jpg';
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: imageKey,
      Body: imageSample,
      ContentType: 'image/jpeg',
    })
  );
  console.log(`✅ Uploaded to R2: ${imageKey}`);

  // 2. Upload a sample campaign video
  const videoSample = Buffer.from('WeGen Campaign Video Stream Raw Footage', 'utf-8');
  const videoKey = 'public/campaigns/chala_cardiac_surgery_plea_video.mp4';
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: videoKey,
      Body: videoSample,
      ContentType: 'video/mp4',
    })
  );
  console.log(`✅ Uploaded to R2: ${videoKey}`);

  // 3. Upload a sample private verification document
  const pdfSample = Buffer.from('WeGen Private Medical Verification PDF Document', 'utf-8');
  const pdfKey = 'private/verifications/tikur_anbessa_hospital_echo_diagnosis.pdf';
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: pdfKey,
      Body: pdfSample,
      ContentType: 'application/pdf',
    })
  );
  console.log(`✅ Uploaded to R2: ${pdfKey}`);

  // 4. List all objects in Cloudflare R2 bucket to verify
  const listResp = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
    })
  );

  console.log('\n📦 Files currently inside Cloudflare R2:');
  listResp.Contents?.forEach((obj: { Key?: string; Size?: number }) => {
    console.log(` - ${obj.Key} (${obj.Size} bytes)`);
  });

  // 5. Update the Document record in Supabase to link to this exact R2 file
  const doc = await prisma.document.findFirst();
  if (doc) {
    await prisma.document.update({
      where: { id: doc.id },
      data: { storagePath: pdfKey },
    });
    console.log(`\n🔗 Linked Supabase Document ID ${doc.id} directly to Cloudflare R2: ${pdfKey}`);
  }

  await prisma.$disconnect();
}

uploadSampleFiles().catch((err) => {
  console.error('❌ Cloudflare R2 upload error:', err);
  process.exit(1);
});
