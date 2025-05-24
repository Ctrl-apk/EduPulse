import React, { useState } from "react";

const FileUploader = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file to upload.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setMessage("Upload successful!");

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default FileUploader;
