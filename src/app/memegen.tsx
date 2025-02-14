"use client";
import { useState } from "react";

export default function Home() {
  const [memeUrl, setMemeUrl] = useState<string | null>(null);

  const generateMeme = async () => {
    const res = await fetch("http://127.0.0.1:8000/create-meme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMemeUrl(data.meme_url);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={generateMeme}
        className="bg-blue-500 text-white p-3 rounded"
      >
        Generate Meme
      </button>

      {memeUrl && (
        <img src={memeUrl} alt="Generated Meme" className="border rounded-lg" />
      )}
    </div>
  );
}
