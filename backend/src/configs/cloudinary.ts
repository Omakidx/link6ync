import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment (CLOUDINARY_URL)
// The CLOUDINARY_URL format is: cloudinary://api_key:api_secret@cloud_name
cloudinary.config();

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = "profile-pictures"
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error("Upload failed: No result returned"));
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export const extractPublicId = (url: string): string | null => {
  // Extract public_id from Cloudinary URL
  // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{ext}
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
};

export default cloudinary;
