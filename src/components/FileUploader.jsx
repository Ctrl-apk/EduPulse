import React from "react";

const FileUploader = ({ onFileContent }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type === "application/pdf") {
      // Pass the file for backend summarization
      onFileContent(null, file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileContent(e.target.result, file);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600"
      />
    </div>
  );
};

export default FileUploader;
