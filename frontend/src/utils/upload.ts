const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const uploadFilesToCloudinary = async (
  files: File | File[],
  preset: string = "structure",
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  const fileArray = Array.isArray(files) ? files : [files];

  for (const file of fileArray) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData },
    );

    const data = await res.json();

    if (data.secure_url) {
      uploadedUrls.push(data.secure_url);
    } else {
      console.error("Upload failed:", data);
    }
  }

  return uploadedUrls;
};
