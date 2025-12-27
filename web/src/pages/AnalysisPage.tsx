import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper } from "../components/Stepper";
import { useToast } from "../components/ToastProvider";
import { clearUploadedPhoto, setUploadedPhoto } from "../lib/storage";

export function AnalysisPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState<string>("Ready");

  const analyzeDisabled = useMemo(
    () => !previewDataUrl || isAnalyzing,
    [previewDataUrl, isAnalyzing],
  );

  const steps = useMemo(
    () => [
      { label: "Upload", description: "Pick a selfie" },
      { label: "Check", description: "Lighting & clarity" },
      { label: "Analyze", description: "Undertone & contrast" },
      { label: "Result", description: "Palette & tips" },
    ],
    [],
  );

  const currentStep = useMemo(() => {
    if (isAnalyzing) return 2;
    if (previewDataUrl) return 1;
    return 0;
  }, [isAnalyzing, previewDataUrl]);

  function onPickFileClick() {
    fileInputRef.current?.click();
  }

  function onFileChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      pushToast({
        title: "Unsupported file",
        message: "Please upload an image file (jpg/png/webp).",
        variant: "error",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== "string") return;
      setPreviewDataUrl(result);
      setUploadedPhoto(result);
      pushToast({
        title: "Photo uploaded",
        message: "Looks good — ready to analyze.",
        variant: "success",
      });
    };
    reader.readAsDataURL(file);
  }

  function onClear() {
    setPreviewDataUrl(null);
    clearUploadedPhoto();
    pushToast({ title: "Cleared", message: "Uploaded photo removed.", variant: "info" });
  }

  useEffect(() => {
    if (!isAnalyzing) return;

    setProgress(0);
    setStageText("Checking lighting…");

    const interval = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(92, p + 4 + Math.random() * 5);
        if (next < 35) setStageText("Checking lighting…");
        else if (next < 70) setStageText("Detecting face & skin tone…");
        else setStageText("Generating palette…");
        return next;
      });
    }, 120);

    return () => window.clearInterval(interval);
  }, [isAnalyzing]);

  async function onAnalyze() {
    if (!previewDataUrl) return;
    setIsAnalyzing(true);
    // Simulate analysis delay (same behavior as the original HTML)
    await new Promise((r) => setTimeout(r, 2000));
    setProgress(100);
    setStageText("Done");
    setIsAnalyzing(false);
    navigate("/result");
  }

  return (
    <div className="page">
      <div className="site-container">
        <div className="gradient-shell">
          <div className="gradient-shell__inner analysis-card">
            <div className="analysis-card__header">
              <h2>AI Color Analysis</h2>
              <p>
                Upload a clear frontal selfie in natural light. We’ll generate a
                palette + styling tips you can apply immediately.
              </p>
            </div>

            <Stepper steps={steps} currentStep={currentStep} />

            <div
              className={`dropzone ${isDragging ? "dropzone--drag" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0] ?? null;
                onFileChange(file);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              />

              {previewDataUrl ? (
                <img
                  className="dropzone__preview"
                  src={previewDataUrl}
                  alt="Preview"
                />
              ) : (
                <div className="dropzone__empty">
                  <div className="dropzone__icon">📸</div>
                  <div className="dropzone__title">Drag & drop a selfie</div>
                  <div className="dropzone__sub">
                    or choose a photo from your device
                  </div>
                </div>
              )}

              <div className="dropzone__actions">
                <button
                  type="button"
                  onClick={onPickFileClick}
                  className="btn btn--secondary"
                  disabled={isAnalyzing}
                >
                  {previewDataUrl ? "Replace photo" : "Choose photo"}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={onClear}
                  disabled={!previewDataUrl || isAnalyzing}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={onAnalyze}
                  disabled={analyzeDisabled}
                >
                  Start analysis
                </button>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="analysis-progress card card--solid">
                <div className="analysis-progress__row">
                  <div className="analysis-progress__label">{stageText}</div>
                  <div className="analysis-progress__pct">
                    {Math.round(progress)}%
                  </div>
                </div>
                <div className="progress-bar" aria-hidden="true">
                  <div
                    className="progress-bar__fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="analysis-tips">
              <div className="analysis-tips__col">
                <div className="analysis-tips__title">Best results</div>
                <ul>
                  <li>Natural light (near a window)</li>
                  <li>Face unobstructed (no hat / heavy shadows)</li>
                  <li>Minimal filters</li>
                </ul>
              </div>
              <div className="analysis-tips__col">
                <div className="analysis-tips__title">Avoid</div>
                <ul>
                  <li>Strong colored lighting</li>
                  <li>Overexposed / blurry selfies</li>
                  <li>Heavy beauty filters</li>
                </ul>
              </div>
            </div>

            <div className="analysis-privacy">
              <span className="analysis-privacy__badge">🔒 Privacy</span>
              This demo stores your uploaded photo locally in your browser
              (localStorage) to show it on the result page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


