"use client"; // This component must be a client component

import { usePost } from "@/store/EditorStore";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { ImageIcon } from "lucide-react";
import { SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const UploadExample = ({
  update,
  setImageUrl,
  getImageUrl,
}: {
  update?: boolean;
  setImageUrl?: (value: SetStateAction<string>) => void;
  getImageUrl?: (url: string) => void;
}) => {
  const { setCoverImage } = usePost();
  // State to keep track of the current upload progress (percentage)
  const [progress, setProgress] = useState(0);
  const [imageState, setState] = useState("hidden");
  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   *
   * This function calls the authentication API endpoint to receive upload parameters like signature,
   * expire time, token, and publicKey.
   *
   * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
   * @throws {Error} Throws an error if the authentication request fails.
   */
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/upload-auth/");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        toast.error("You must be an author in order to upload images");
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleCoverUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        folder: "CoverImages/",
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      const url = uploadResponse.url;
      setCoverImage(url);
      // Handle cover image update
      if (url && getImageUrl) getImageUrl(url);
      
      toast.success("Cover Image uploaded successfully!");
      setTimeout(() => {
        setProgress(0);
      }, 2000);
      setState("");
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const url = URL.createObjectURL(e.target.files[0]);
      if (url) {
        if (setImageUrl) {
          setImageUrl(url);
        }
      }
    }
  };
  return (
    <>
      {!update ? (
        <div>
          {/* File input element using React ref */}
          <div className="border-[1px] border-foreground flex justify-between gap-2 items-center rounded-sm">
            <label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="text-foreground w-10 h-10" />
              <p className="text-foreground/70 font-bold text-xs">
                Choose an image to upload
              </p>
              <input
                className="hidden"
                id="image"
                type="file"
                ref={fileInputRef}
              />
            </label>
            {/* Button to trigger the upload process */}
            <button
              type="button"
              onClick={handleCoverUpload}
              className="bg-foreground/80 text-background py-2 px-1 rounded-sm"
            >
              Upload file
            </button>
          </div>
          <p className={`text-sky-500 text-sm ${imageState}`}>
            Image Uploaded successfully!
          </p>
          {/* Display the current upload progress */}
          <div className="flex items-center gap-2">
            <p className="text-sm">Progress:</p>{" "}
            <progress
              value={progress}
              max={100}
              className="h-1 text-fuchsia-400"
            />
          </div>
        </div>
      ) : (
        <div>
          <input
            className="hidden"
            id="image"
            type="file"
            
            onChange={(e) => handleImageChange(e)}
            ref={fileInputRef}
          />
          <div
            className="disabled:bg-gray-400 text-center bg-amber-700 p-1 w-fit rounded-sm text-xs"
            onClick={handleCoverUpload}
          >
            Upload
          </div>
        </div>
      )}
    </>
  );
};

export default UploadExample;
