import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/useAuth";
import { FileDropzone } from "../../components/upload/FileDropzone";
import { uploadECG } from "../../services/ecg.service";
import { HeartPulse } from "lucide-react";
import toast from "react-hot-toast";

export default function PatientUploadECG() {
  //   const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("ecgFile", file);
    // No patientId needed here - backend gets it from the token

    try {
      setUploading(true);
      const result = await uploadECG(formData, (p) => setProgress(p));
      toast.success("ECG Uploaded Successfully");
      navigate(`/patient/analyze/${result.id}`);
    } catch (err) {
      toast.error("Upload failed. Please check the file format.");
      console.log(err);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HeartPulse className="text-blue-600 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Your ECG</h1>
        <p className="text-gray-500">
          Monitor your heart health by uploading your latest ECG recording.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <FileDropzone
          onFileSelect={(f) => setFile(f)}
          error={file ? undefined : "Accepted: .csv, .mat, .txt"}
        />

        {file && !uploading && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium truncate">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 text-xs font-bold"
            >
              Change
            </button>
          </div>
        )}

        {uploading ? (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase text-blue-600">
              <span>Uploading Data...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleUpload}
            disabled={!file}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 transition-all"
          >
            Submit for Analysis
          </button>
        )}
      </div>
    </div>
  );
}
