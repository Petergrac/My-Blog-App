import { supabase } from "./supabase.config";

export const uploadImage = async (file: FileList) => {
  const originalFile = file[0];

  //   Recreating the file in order to mutate the filename
  const fileName = Date.now();
  const fileExtension = originalFile.name.split(".")[1];
  const newFile = new File(
    [originalFile],
    `${fileName}${originalFile.name.split(".")[0]}.${fileExtension}`,
    {
      type: originalFile.type,
    }
  );

  // Handling file upload

  //   File path
  const filePath = `cover-images/${newFile.name}`;
  const { data,error } = await supabase.storage
    .from("blog-post")
    .upload(filePath, newFile, { upsert: false });
  if (data) {
    const { data } = supabase.storage.from("blog-post").getPublicUrl(filePath);
    return data.publicUrl;
  }
  if (error) {
    throw new Error("Error uploading file");
  }
};
