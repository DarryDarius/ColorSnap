import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUploadedPhoto } from "../lib/storage";

export function AnalysisPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeDisabled = useMemo(
    () => !previewDataUrl || isAnalyzing,
    [previewDataUrl, isAnalyzing],
  );

  function onPickFileClick() {
    fileInputRef.current?.click();
  }

  function onFileChange(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== "string") return;
      setPreviewDataUrl(result);
      setUploadedPhoto(result);
    };
    reader.readAsDataURL(file);
  }

  async function onAnalyze() {
    if (!previewDataUrl) return;
    setIsAnalyzing(true);
    // Simulate analysis delay (same behavior as the original HTML)
    await new Promise((r) => setTimeout(r, 2000));
    setIsAnalyzing(false);
    navigate("/result");
  }

  return (
    <section className="upload-section">
      <h2>Upload Photo for Color Analysis</h2>
      <p>
        Please upload a clear frontal selfie taken in natural light, with your
        face unobstructed and ideally showing your hair and eyes.
        <br />
        <small>
          Privacy Notice: Your photo is used for analysis only and will not be
          saved or shared.
        </small>
      </p>

      <div className="upload-area">
        <button type="button" onClick={onPickFileClick} className="upload-btn">
          Choose Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />

        <div id="preview">
          {previewDataUrl ? (
            <img src={previewDataUrl} alt="Preview image" width={300} />
          ) : null}
        </div>
      </div>

      <button id="analyzeBtn" onClick={onAnalyze} disabled={analyzeDisabled}>
        Start Analysis
      </button>
      <div id="loading" className={isAnalyzing ? "" : "hidden"}>
        Analyzing, please wait...
      </div>
    </section>
  );
}


