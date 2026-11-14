import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero">
        <p className="tag">✨ Powered by Advanced AI Technology</p>

        <h1>
          AI-Powered <br />
          <span>Artwork Restoration</span>
        </h1>

        <p className="desc">
          Restore the past, preserve the future. Transform damaged artworks into pristine masterpieces using cutting-edge AI technology.
        </p>

        <div className="cards">
          <div className="card">
            <button onClick={() => navigate("/upload")} className="primary">
            <h3>🎨 GAN + SSL Technology</h3>
            <p>Fast restoration using GAN</p>
            </button>
          </div>

          <div className="card">
            <button onClick={() => navigate("/upload")} className="primary">
              <h3>✨ Stable Diffusion</h3>
              <p>High quality restoration with creativity</p>
            </button>
          </div>

        </div>

        <div className="buttons">
          <button onClick={() => navigate("/upload")} className="primary">
            Try Restoration Now ➡️
          </button>
          <button className="secondary">View Examples</button>
        </div>
      </div>
    </div>
  );
}