import { useState } from "react";
import axios from "axios";

const GAN_URL = (import.meta.env.VITE_GAN_URL || "").replace(/\/$/, "");
const SD_GRADIO_URL = (import.meta.env.VITE_SD_GRADIO_URL || "").replace(/\/$/, "");

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mode, setMode] = useState("gan");
  const [style, setStyle] = useState("modern");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSDModal, setShowSDModal] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleModeChange = (val) => {
    setMode(val);
    if (val === "sd") {
      setShowSDModal(true); // ✅ open modal when SD selected
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Upload a file first.");

    if (mode === "sd") {
      if (!SD_GRADIO_URL) {
        alert("Set VITE_SD_GRADIO_URL in frontend/.env to the Gradio link from Stable_Diffusion.ipynb, then restart the dev server.");
        return;
      }
      setShowSDModal(true);
      return;
    }

    if (!GAN_URL) {
      alert("Set VITE_GAN_URL in frontend/.env to the ngrok link from LatestGAN.ipynb, then restart the dev server.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${GAN_URL}/restore`,
        formData,
        {
          responseType: "blob",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const imageUrl = URL.createObjectURL(res.data);
      setResult(imageUrl);

    } catch (err) {
      console.error(err);
      alert("Error during restoration. Is Colab running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="container">
        <h1>Upload Your Artwork</h1>

        <div className="upload-container">

          {/* LEFT */}
          <div className="dropbox">
            <p>📁</p>
            <h3>Drag & drop your artwork here</h3>
            <p>or click to browse files</p>

            <input type="file" onChange={handleFile} />

            <button className="browse-btn">Browse Files</button>

            <hr />

            <small>Supported formats: JPG, PNG, WEBP</small>
            <br />
            <small>Max file size: 10MB</small>

            {preview && (
              <>
                <h4 style={{ marginTop: "20px" }}>Preview</h4>
                <img src={preview} alt="preview" width="250"
                  style={{ borderRadius: "10px" }} />
              </>
            )}
          </div>

          {/* RIGHT */}
          <div className="settings">
            <h3>Restoration Mode</h3>

            <label>
              <input type="radio" value="gan" checked={mode === "gan"}
                onChange={() => handleModeChange("gan")} />
              GAN (Fast)
              <p>Quick restoration using Generative Adversarial Networks</p>
            </label>

            <label>
              <input type="radio" value="sd" checked={mode === "sd"}
                onChange={() => handleModeChange("sd")} />
              Stable Diffusion (High Quality)
              <p>Detailed restoration with advanced AI models</p>
            </label>

            <button onClick={handleUpload} disabled={loading}>
              {loading
                ? mode === "sd"
                  ? "⏳ Running SD... (60-120s)"
                  : "⏳ Processing... (30-60s)"
                : "✨ Start Restoration"}
            </button>
          </div>
        </div>

        {/* OUTPUT */}
        {result && (
          <div style={{ marginTop: "50px", textAlign: "center" }}>
            <h2>✨ Restored Result</h2>
            <img src={result} width="300"
              style={{ borderRadius: "12px", marginTop: "20px" }} />
            <br />
            <a href={result} download="restored.png" style={{
              display: "inline-block", marginTop: "16px",
              padding: "10px 24px", background: "#7c3aed",
              color: "#fff", borderRadius: "8px", textDecoration: "none"
            }}>
              ⬇️ Download Restored Photo
            </a>
          </div>
        )}
      </div>

      {/* ── SD MODAL ─────────────────────────────────────────── */}
      {showSDModal && (
        <div style={{
          position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.75)",
          zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            width: "90%", maxWidth: "1000px",
            height: "85vh",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
          }}>

            {/* Modal Header */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "16px 24px",
              borderBottom: "1px solid #e5e7eb",
              background: "#7c3aed"
            }}>
              <h2 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>
                🎨 Stable Diffusion Restoration
              </h2>
              <button
                onClick={() => setShowSDModal(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none", color: "#fff",
                  borderRadius: "8px", padding: "6px 14px",
                  cursor: "pointer", fontSize: "16px"
                }}
              >
                ✕ Close
              </button>
            </div>

            {SD_GRADIO_URL ? (
              <iframe
                src={SD_GRADIO_URL}
                style={{
                  flex: 1, width: "100%",
                  border: "none"
                }}
                title="Stable Diffusion Restoration"
              />
            ) : (
              <p style={{ padding: "24px" }}>
                Set VITE_SD_GRADIO_URL in frontend/.env, then restart the dev server.
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}