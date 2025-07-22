import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import supabase from "../configs/supabase";

export default function AvatarUpload({ userId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Handle mime type
    if (!selected.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Handle storage
    if (selected.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      return;
    }

    // Save the file
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file || !userId) return;
    setLoading(true);

    // Extract the file extension
    const fileExt = file.name.split(".").pop();
    // Create a file path
    const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

    // Upload the file to supabase
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    // Handle upload errors
    if (error) {
      alert("Upload failed.");
      console.error(error);
    } else {
      // Get the public URL of your avatar
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      onUploaded?.(data.publicUrl);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 w-64 bg-slate-900 text-white rounded-lg shadow-md space-y-4">
      <div className="flex flex-col items-center gap-2">
        <label
          htmlFor="avatar"
          className="cursor-pointer w-24 h-24 rounded-full overflow-hidden border border-gray-700"
        >
          <img
            src={preview || "https://placehold.co/96x96?text=Avatar"}
            alt="Avatar Preview"
            className="w-full h-full object-cover"
          />
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-4 rounded text-sm flex items-center gap-1 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" /> Uploading...
            </>
          ) : (
            <>
              <p className="w-4 h-4" /> Upload Avatar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
