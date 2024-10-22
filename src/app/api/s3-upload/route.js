import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const bucketName = process.env.S3_BUCKET_NAME;
// const bucketRegion = process.env.S3_REGION;

const bucketName = "lms-xd-bucket";
const bucketRegion = "ap-south-1";
const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: "AKIA2IFXYGKMJFEIXSVK",
    secretAccessKey: "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",
    // accessKeyId: process.env.S3_ACCESS_KEY_ID,
    // secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const uploadToS3 = async (file, fileName, category) => {
  // console.log("access key:", process.env.S3_ACCESS_KEY_ID);
  // console.log("secret key:", process.env.S3_SECRET_KEY);
  const params = {
    Bucket: bucketName,
    Key: `assets/${category}/${fileName}`,
    Body: await file.arrayBuffer(),
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("File uploaded successfully", data);
    return fileName;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const category = formData.get("category");

    // // Debugging logs
    // console.log("File:", file);
    // console.log("Category:", category); // Ensure category is being received correctly

    // Ensure both file and category are present
    if (!file || !category) {
      throw new Error("File or category is missing");
    }

    const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/assets/${category}`;
    const fileName = await uploadToS3(file, file.name, category);
    console.log(bucketName);
    console.log(url);
    console.log(fileName);
    return NextResponse.json({ success: "File uploaded", fileName, url });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: error.message });
  }
}
