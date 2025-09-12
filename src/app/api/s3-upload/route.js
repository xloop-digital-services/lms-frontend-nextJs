import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function getS3Config() {
  const res = await fetch("https://api.lms.xloopdigital.com/api/attendance/s3-config/");
  if (!res.ok) {
    throw new Error("Failed to fetch S3 config");
  }
  return res.json();
}

async function uploadToS3(file, fileName, category, config) {
  const s3Client = new S3Client({
    region: config.S3_REGION,
    credentials: {
      accessKeyId: config.S3_ACCESS_KEY_ID,
      secretAccessKey: config.S3_SECRET_KEY,
    },
  });

  const params = {
    Bucket: config.S3_BUCKET_NAME,
    Key: `assets/${category}/${fileName}`,
    Body: Buffer.from(await file.arrayBuffer()), 
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return fileName;
  } catch (error) {
    throw error;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const category = formData.get("category");

    if (!file || !category) {
      throw new Error("File or category is missing");
    }

    const config = await getS3Config();

    const fileName = await uploadToS3(file, file.name, category, config);

    const url = `https://${config.S3_BUCKET_NAME}.s3.${config.S3_REGION}.amazonaws.com/assets/${category}/${fileName}`;

    return NextResponse.json({ success: "File uploaded", fileName, url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
