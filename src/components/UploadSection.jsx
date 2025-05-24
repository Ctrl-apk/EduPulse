import { useState } from "react";
import { extractTextFromPdf } from "../utils/pdfParser";

const UploadSection = ({ onTextExtracted }) =>{
    const[file, setFile] = useState(null);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () =>{
        if(file) {
            const extractedText = await extractTextFromPdf(file);
            onTextExtracted(extractedText);
        }
    }
    return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
        Upload & Extract
      </button>
    </div>
  );
}

export default UploadSection;