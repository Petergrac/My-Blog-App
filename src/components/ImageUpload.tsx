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

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [fileName, setFileName] = useState("");
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
    setFileName(file.name);

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
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      const url = URL.createObjectURL(e.target.files[0]);
      if (url) {
        if (setImageUrl) {
          setImageUrl(url);
        }
      }
    }
  };

  const hasUploaded = imageState === "";

  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4",
        update ? "space-y-3" : "space-y-4",
      )}
    >
      <input
        className="hidden"
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
      />

      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-background p-3 shadow-sm">
          <ImageIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {update ? "Replace cover image" : "Upload your cover image"}
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            Use a clean landscape image for the best card and landing-page
            presentation.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose image
        </Button>
        <Button type="button" onClick={handleCoverUpload}>
          Upload to library
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {fileName
            ? `${fileName} selected`
            : "No file selected yet. Choose a file before uploading."}
        </p>
        {(progress > 0 || hasUploaded) && (
          <div className="space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{ width: `${hasUploaded ? 100 : progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {hasUploaded
                ? "Image uploaded successfully."
                : `${Math.round(progress)}% uploaded`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadExample;
