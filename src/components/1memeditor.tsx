"use client"
import React, { useState } from "react";
import axios from "axios";

export default function MemeEditor() {
  const [userInput, setUserInput] = useState("");
  const [suggestedCaptions, setSuggestedCaptions] = useState<string[]>([]);
  const [editedCaption, setEditedCaption] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");

  const generateCaption = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-caption",
        { text: userInput },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuggestedCaptions([response.data.caption]);
      setEditedCaption(response.data.caption);
    } catch (error) {
      console.error("Error generating caption:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          🖼️ AI Meme Generator
        </h1>

        {/* Input Field */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter text for AI caption..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={generateCaption}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            ✨ Generate Caption
          </button>
        </div>

        {/* Suggested Captions */}
        {suggestedCaptions.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Suggested Captions 🎭
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              {suggestedCaptions.map((caption, index) => (
                <p key={index} className="text-gray-800 font-medium">
                  🎤 {caption}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Editing Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Edit Meme ✏️</h3>
          <input
            type="text"
            value={editedCaption}
            onChange={(e) => setEditedCaption(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between mt-4">
          <div>
            <label className="text-gray-700 font-medium">Font Size:</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="ml-2 w-16 p-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Font Color:</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="ml-2"
            />
          </div>

          <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
            📸 Create Meme
          </button>
        </div>
      </div>
    </div>
  );
}
