import React, { useState } from "react";
import { extractTextFromPdf } from "../utils/pdfParser";

function FileUploader({ onFileContent }) {
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (!["application/pdf", "text/plain"].includes(file.type)) {
      setError("Only PDF or plain text files are supported.");
      return;
    }
    try {
      if (file.type === "text/plain") {
        const text = await file.text;
        onFileContent(text);
      } else if (file.type === "application/pdf") {
        const text = await extractTextFromPdf(file);
        onFileContent(text);
      }
    } catch (error) {
      setError("Error reading file...");
      console.error(error);
    }
  };
  return (
    <div className="p-4 border border-gray-300 rounded-md max-w-md mx-auto">
      <label htmlFor="file-upload" className="block mb-2 font-medium">
        Upload Lecture Notes (PDF or Text)
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".pdf,text/plain"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
      />
      {fileName && <p className="mt-2 text-gray-700">Selected: {fileName}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}

export default FileUploader;
