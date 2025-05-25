import React, { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";

const FileUploader = ({ onFileContent }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    if (!file) return;

    if (file.type === "application/pdf") {
      onFileContent(null, file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        onFileContent(event.target.result, file);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFileName(file ? file.name : "");
    if (!file) return;
    if (file.type === "application/pdf") {
      onFileContent(null, file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        onFileContent(event.target.result, file);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className="file-uploader-glow flex flex-col items-center justify-center mb-6"
      style={{ minHeight: 120 }}
      onClick={() => fileInputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <FaFileUpload size={40} color="#00ffe7" className="mb-2" />
      <span className="text-lg font-bold gaming-title" style={{ color: "#00ffe7" }}>
        {fileName ? (
          <span>
            <span className="mr-2">🎮</span>
            {fileName}
          </span>
        ) : (
          <>
            Click or Drag & Drop to <span className="underline">Choose File</span>
          </>
        )}
      </span>
      <span className="text-xs mt-2 text-gray-300">
        Supported: PDF or plain text files
      </span>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.txt"
        onChange={handleFileChange}
      />
      {/* Fun overlay */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 16,
          fontSize: 24,
          opacity: 0.2,
          pointerEvents: "none",
        }}
      >
        🕹️
      </div>
    </div>
  );
};

export default FileUploader;
