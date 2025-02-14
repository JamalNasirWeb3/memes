"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface MemeTemplate {
    name: string;
    url: string;
}

const MemeEditor: React.FC = () => {
    const [caption, setCaption] = useState<string>("");
    const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
    const [selectedCaption, setSelectedCaption] = useState<string>("");
    const [fontSize, setFontSize] = useState<number>(20);
    const [fontColor, setFontColor] = useState<string>("#000000");
    const [memeTemplates, setMemeTemplates] = useState<MemeTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");

    useEffect(() => {
        axios.get<MemeTemplate[]>("http://127.0.0.1:8000/meme-templates")
            .then(response => {
                setMemeTemplates(response.data);
                if (response.data.length > 0) {
                    setSelectedTemplate(response.data[0].url);
                }
            })
            .catch(error => console.error("Error fetching meme templates:", error));
    }, []);

    const generateCaptions = async () => {
        try {
            const response = await axios.post<{ captions: string[] }>("http://127.0.0.1:8000/generate-caption", { text: caption });
            setGeneratedCaptions(response.data.captions);
        } catch (error) {
            console.error("Error generating captions:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-4">📸 AI Meme Generator</h1>

                {/* Input for Meme Caption */}
                <input 
                    type="text" 
                    placeholder="Enter text for AI caption..." 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full p-2 border rounded mb-4" 
                />

                {/* Generate AI Captions */}
                <button onClick={generateCaptions} className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600">
                    ✨ Generate Captions
                </button>

                {/* Display Suggested Captions */}
                {generatedCaptions.length > 0 && (
                    <div className="bg-gray-100 p-4 rounded mb-4">
                        <h2 className="font-bold mb-2">Suggested Captions 🤹‍♂️</h2>
                        <ul className="space-y-2">
                            {generatedCaptions.map((text, index) => (
                                <li 
                                    key={index} 
                                    className="cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => setSelectedCaption(text)}
                                >
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Edit Meme Text */}
                <h2 className="font-bold mb-2">Edit Meme ✏️</h2>
                <input 
                    type="text" 
                    value={selectedCaption} 
                    onChange={(e) => setSelectedCaption(e.target.value)}
                    className="w-full p-2 border rounded mb-2" 
                />
                {/* Ensure generatedCaptions is defined before checking length */}
{Array.isArray(generatedCaptions) && generatedCaptions.length > 0 && (
    <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Suggested Captions 🤹‍♂️</h2>
        <ul className="space-y-2">
            {generatedCaptions.map((text, index) => (
                <li 
                    key={index} 
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setSelectedCaption(text)}
                >
                    {text}
                </li>
            ))}
        </ul>
    </div>
)}


                {/* Font Size & Color Settings */}
                <div className="flex space-x-4 mb-4">
                    <label className="flex items-center">
                        Font Size: 
                        <input 
                            type="number" 
                            value={fontSize} 
                            onChange={(e) => setFontSize(Number(e.target.value))} 
                            className="ml-2 p-1 border rounded w-16" 
                        />
                    </label>
                    
                    <label className="flex items-center">
                        Font Color: 
                        <input 
                            type="color" 
                            value={fontColor} 
                            onChange={(e) => setFontColor(e.target.value)} 
                            className="ml-2 p-1 border rounded" 
                        />
                    </label>
                </div>

                {/* Meme Template Selection */}
                <label className="font-bold">Choose Template:</label>
                <select
                    className="w-full p-2 border rounded mb-4"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                    {memeTemplates.map((template, index) => (
                        <option key={index} value={template.url}>{template.name}</option>
                    ))}
                </select>

                {/* Display Meme Template */}
                {selectedTemplate && (
                    <div className="mb-4 flex justify-center">
                        <img src={selectedTemplate} alt="Meme Template" className="max-w-full h-auto rounded shadow-lg" />
                    </div>
                )}

                {/* Final Meme Creation Button */}
                <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    📸 Create Meme
                </button>
            </div>
        </div>
    );
};

export default MemeEditor;
