import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setFile(selectedFile);
    setError("");
    setResult("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an MRI image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      const response = await axios.post("http://localhost:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.stage);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Something went wrong. Please check the backend connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    setError("");
  };

  const getResultColor = (stage) => {
    const stageMap = {
      "No Dementia": "#10b981",
      "Very Mild": "#f59e0b",
      "Mild": "#f97316",
      "Moderate": "#ef4444",
    };
    return stageMap[stage] || "#6366f1";
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-content">
          <div className="icon-wrapper">🧠</div>
          <div>
            <h1 className="main-title">Alzheimer's Disease Detection</h1>
            <p className="subtitle">AI-powered MRI analysis for early detection</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="upload-section">
          <div
            className={`drop-zone ${dragActive ? "active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="MRI Preview" className="preview-image" />
                <p className="file-name">{file.name}</p>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📤</div>
                <h3>Drag and drop your MRI image here</h3>
                <p>or</p>
                <label htmlFor="file-input" className="browse-link">
                  browse from your computer
                </label>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`btn btn-primary ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                "Analyze MRI Image"
              )}
            </button>

            {file && (
              <button onClick={handleReset} className="btn btn-secondary">
                Clear
              </button>
            )}
          </div>
        </div>

        {result && (
          <div className="result-section">
            <div className="result-card" style={{ borderLeftColor: getResultColor(result) }}>
              <h2 className="result-label">Analysis Result</h2>
              <div className="result-stage" style={{ color: getResultColor(result) }}>
                {result}
              </div>
              <div className="result-description">
                <p>The AI model has analyzed the MRI image and predicted the dementia stage.</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-section">
            <div className="loading-card">
              <div className="spinner-large"></div>
              <p>Analyzing your MRI image...</p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="footer">
        <p>⚠️ Disclaimer: This tool is for research purposes only and should not be used for medical diagnosis.</p>
      </div>
    </div>
  );
}

export default App;