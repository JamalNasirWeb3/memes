"use client"
import { useState, useEffect } from "react";
import axios from "axios";

interface MemeTemplate {
  name: string;
  url: string;
}

const MemeEditor = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [editedCaption, setEditedCaption] = useState<string>("");
  const [suggestedCaptions, setSuggestedCaptions] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [memeTemplates, setMemeTemplates] = useState<MemeTemplate[]>([]);
  const [memeImage, setMemeImage] = useState<string | null>(null);
  const [templateImage, setTemplateImage] = useState<string | null>(null);

  // Fetch meme templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:8000/meme-templates");
        setMemeTemplates(response.data);
        if (response.data.length > 0) {
          setSelectedTemplate(response.data[0].url);
          setTemplateImage(response.data[0].url); // Set the initial template image
        }
      } catch (error) {
        console.error("Failed to fetch meme templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  // Update template image when selected template changes
  useEffect(() => {
    if (selectedTemplate) {
      setTemplateImage(selectedTemplate);
    }
  }, [selectedTemplate]);

  const generateCaption = async () => {
    try {
      const response = await axios.post("http://localhost:8000/generate-caption", { text: userInput });
      console.log("API Response:", response.data); // Debugging line
      setSuggestedCaptions([response.data.caption]);
      setEditedCaption(response.data.caption); // Set the edited caption to the generated caption
    } catch (error) {
      console.error("Failed to generate caption:", error);
    }
  };

  const createMeme = () => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.crossOrigin = "anonymous"; // Allow loading images from external URLs
    img.src = selectedTemplate;
  
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }
  
      ctx.drawImage(img, 0, 0);
  
      // Add top text (user input)
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = "center"; // Center the text horizontally
      ctx.fillText(userInput, canvas.width / 2, 50); // Adjust Y position as needed
  
      // Add bottom text (edited caption)
      ctx.fillText(editedCaption, canvas.width / 2, canvas.height - 50); // Adjust Y position as needed
  
      // Convert canvas to image
      setMemeImage(canvas.toDataURL("image/png"));
    };
  
    img.onerror = () => {
      console.error("Failed to load the template image");
    };
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
  <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>An AI Meme Generator</h1>

  {/* Input for AI caption */}
  <div style={{ marginBottom: "20px", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
    <h2 style={{ marginBottom: "10px", color: "#555" }}>Enter text for AI captions...</h2>
    <textarea
      placeholder="Type your text here..."
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      style={{ width: "100%", height: "100px", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
    />
    <button
      onClick={generateCaption}
      style={{
        marginTop: "10px",
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Generate Captions
    </button>
  </div>

  {/* Generated Captions Section */}
  {suggestedCaptions.length > 0 && (
    <div style={{ marginBottom: "20px", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ marginBottom: "10px", color: "#555" }}>Generated Captions</h2>
      {suggestedCaptions.map((caption, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <textarea
            value={caption}
            readOnly
            style={{ width: "100%", height: "100px", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
          <button
            onClick={() => setEditedCaption(caption)}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Use This Caption
          </button>
        </div>
      ))}
    </div>
  )}

  {/* Edit Meme Section */}
  <div style={{ marginBottom: "20px", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
    <h2 style={{ marginBottom: "20px", color: "#555" }}>Edit Meme</h2>

    {/* Template Image Preview */}
    {templateImage && (
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "10px", color: "#555" }}>Selected Template</h3>
        <img
          src={templateImage}
          alt="Selected Template"
          style={{ maxWidth: "100%", border: "1px solid #ddd", borderRadius: "5px" }}
        />
      </div>
    )}

    {/* Edit Caption */}
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "10px", color: "#555" }}>
        Edit Caption:
        <textarea
          value={editedCaption}
          onChange={(e) => setEditedCaption(e.target.value)}
          style={{ width: "100%", height: "100px", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
        />
      </label>
    </div>

    {/* Font Customization */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "10px", color: "#555" }}>
          Font Size:
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "100%", padding: "5px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </label>
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "10px", color: "#555" }}>
          Font Color:
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            style={{ width: "100%", padding: "5px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </label>
      </div>
    </div>

    {/* Template Selection */}
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "10px", color: "#555" }}>
        Choose Template:
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
        >
          {memeTemplates.map((template) => (
            <option key={template.url} value={template.url}>
              {template.name}
            </option>
          ))}
        </select>
      </label>
    </div>

    {/* Create Meme Button */}
    <button
      onClick={createMeme}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Create Meme
    </button>
  </div>

  {/* Meme Preview */}
  {memeImage && (
    <div style={{ marginTop: "20px", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ marginBottom: "10px", color: "#555" }}>Your Meme</h2>
      <img
        src={memeImage}
        alt="Generated Meme"
        style={{ maxWidth: "100%", border: "1px solid #ddd", borderRadius: "5px" }}
      />
      <a
        href={memeImage}
        download="meme.png"
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Download Meme
      </a>
    </div>
  )}
</div>
  );
};

export default MemeEditor;