import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName=process.env.AWS_S3_BUCKET_NAME
const bucketRegion=process.env.AWS_S3_REGION
const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

const uploadToS3 = async (file, fileName, category) => {
  // console.log("access key:", process.env.AWS_S3_ACCESS_KEY_ID);
  // console.log("secret key:", process.env.AWS_S3_SECRET_KEY);
  const params = {
    Bucket: bucketName,
    Key: `assets/${category}/${fileName}`,
    Body: await file.arrayBuffer(), // Add await here
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("File uploaded successfully", data);
    return fileName; // Return the fileName correctly
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

    return NextResponse.json({ success: "File uploaded", fileName, url });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: error.message });
  }
}
