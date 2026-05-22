'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Star, 
  Zap, 
  Diamond, 
  Flower2, 
  Dog, 
  CircleDashed, 
  Flame, 
  Moon, 
  Smile, 
  Feather, 
  Scissors 
} from 'lucide-react';

const SUGGESTIONS = [
  "A geometric wolf with constellation patterns",
  "Minimalist cherry blossom branch",
  "Sacred geometry mandala with golden ratio",
  "Serpent wrapped around a crescent moon"
];

const STYLES = [
  { name: 'Minimalist', icon: Zap },
  { name: 'Geometric', icon: Diamond },
  { name: 'Floral', icon: Flower2 },
  { name: 'Animal', icon: Dog },
  { name: 'Abstract', icon: CircleDashed },
  { name: 'Tribal', icon: Flame },
];

const MOODS = [
  { name: 'Bold', icon: Flame },
  { name: 'Delicate', icon: Feather },
  { name: 'Mysterious', icon: Moon },
  { name: 'Playful', icon: Smile },
  { name: 'Elegant', icon: Diamond },
  { name: 'Edgy', icon: Scissors },
];

const PLACEMENTS = [
  'Wrist', 'Forearm', 'Shoulder', 'Ankle', 'Neck', 'Full Sleeve'
];

export default function TattooStudio() {
  const [vision, setVision] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Minimalist');
  const [selectedMood, setSelectedMood] = useState('Bold');
  const [selectedPlacement, setSelectedPlacement] = useState('Forearm');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!vision) return;
    setIsGenerating(true);
    setError(null);
    
    // Master prompt constructed from user selections
    //const prompt = `A highly detailed, professional tattoo design. Subject: ${vision}. Art Style: ${selectedStyle}. Mood/Vibe: ${selectedMood}. Placement: ${selectedPlacement}. Isolated on a solid dark background, studio lighting, sticker style layout, production-ready tattoo flash art.`;
    const prompt = `A professional, production-ready tattoo flash design featuring ${vision}. 
    Style: Rendered in a distinct ${selectedStyle} aesthetic. 
    Mood & Atmosphere: Infused with a ${selectedMood} vibe. 
    Execution Details: Clean vector-aligned linework, high-contrast shading, crisp contours, and saturated ink gradients. Designed specifically to fit perfectly on the ${selectedPlacement}. 
    Presentation: Isolated asset centered on a solid, seamless dark background. Studio lighting, sticker-style layout with a clean edge definition, suitable for a tattooist's stencil framework. No skin textures, no body parts, pure flash art design.`;
    try {
      // Secure call to your Next.js API route
    //   const response = await fetch('/api/generate-tattoo', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ prompt }), 
    //   });
    const response = await fetch('/api/generate-tattoo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            prompt,
            provider: 'huggingface' // Options: 'huggingface', 'gemini', or 'openai'
        }), 
    });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setGeneratedImage(data.imageUrl);

    } catch (err: any) {
      console.error("Failed to generate tattoo:", err);
      setError(err.message || "Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-12">
        <h4 className="text-[#8b5cf6] text-xs md:text-sm tracking-widest font-semibold mb-4 uppercase flex items-center gap-2">
          <span className="w-8 h-[1px] bg-[#8b5cf6]"></span> AI Design Studio
        </h4>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            DESCRIBE IT.<br />
            <span className="text-[#f97316]">WE CREATE IT.</span>
          </h1>
          <p className="text-gray-400 max-w-md text-sm leading-relaxed">
            Our AI has been trained on thousands of tattoo styles. Describe your vision — our engine generates production-ready sticker tattoo designs in seconds.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Controls */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Vision Input Card */}
          <div className="bg-[#121214] p-5 md:p-6 rounded-2xl border border-white/5 shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-sm font-medium">
              <div className="bg-[#8b5cf6]/20 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
              </div>
              Describe Your Vision
            </div>
            
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="E.g., a minimalist geometric wolf with constellation patterns and fine line art style..."
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 h-32 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all resize-none mb-4"
            />
            
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-semibold mb-3 tracking-wider">TRY THESE:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setVision(sug)}
                    className="text-[10px] md:text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1.5 rounded-full border border-white/5 transition-colors text-left"
                  >
                    {sug.length > 35 ? sug.substring(0, 35) + '...' : sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Options */}
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 font-semibold mb-3 tracking-wider">STYLE</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.name}
                  onClick={() => setSelectedStyle(style.name)}
                  className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    selectedStyle === style.name
                      ? 'bg-[#8b5cf6]/10 border border-[#8b5cf6]/50 text-[#8b5cf6]'
                      : 'bg-[#121214] border border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <style.icon className="w-3 h-3 md:w-4 md:h-4" /> {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Options */}
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 font-semibold mb-3 tracking-wider">MOOD</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {MOODS.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    selectedMood === mood.name
                      ? 'bg-[#f97316]/10 border border-[#f97316]/50 text-[#f97316]'
                      : 'bg-[#121214] border border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <mood.icon className="w-3 h-3 md:w-4 md:h-4" /> {mood.name}
                </button>
              ))}
            </div>
          </div>

          {/* Placement Options */}
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 font-semibold mb-3 tracking-wider">PLACEMENT</p>
            <div className="flex flex-wrap gap-2">
              {PLACEMENTS.map((place) => (
                <button
                  key={place}
                  onClick={() => setSelectedPlacement(place)}
                  className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                    selectedPlacement === place
                      ? 'bg-[#facc15] text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                      : 'bg-[#121214] border border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {place}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button & Error Handling */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={!vision || isGenerating}
              className={`w-full py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 text-sm md:text-base font-semibold transition-all ${
                vision && !isGenerating
                  ? 'bg-white text-black hover:bg-gray-200 cursor-pointer shadow-lg'
                  : 'bg-[#121214] text-gray-600 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              {isGenerating ? 'Generating Vision...' : 'Generate My Designs'}
            </button>
            
            {error && (
              <p className="text-red-400 text-xs md:text-sm text-center mt-3 bg-red-400/10 py-2 rounded-lg">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Output Area */}
        <div className="bg-[#121214] rounded-2xl border border-white/5 shadow-xl min-h-[400px] md:min-h-[600px] flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#09090b]/50">
            <Star className="w-4 h-4 text-[#eab308]" />
            <span className="text-sm font-medium">AI Creations</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative bg-[#121214]">
            {isGenerating ? (
              <div className="animate-pulse flex flex-col items-center">
                <Wand2 className="w-10 h-10 md:w-12 md:h-12 text-[#8b5cf6] mb-4 animate-spin-slow" />
                <h3 className="text-base md:text-lg font-medium text-white mb-2">Summoning your design...</h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Blending {selectedStyle} style with a {selectedMood.toLowerCase()} mood.
                </p>
              </div>
            ) : generatedImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={generatedImage} 
                  alt="Generated Tattoo Design" 
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                />
              </div>
            ) : (
              <>
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#8b5cf6]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#8b5cf6]/20">
                  <Wand2 className="w-7 h-7 md:w-8 md:h-8 text-[#8b5cf6]" />
                </div>
                <h3 className="text-base md:text-lg font-medium text-white mb-2">Your designs will appear here</h3>
                <p className="text-xs md:text-sm text-gray-500 max-w-xs leading-relaxed">
                  Describe your vision, pick a style and mood, then hit generate
                </p>
                <div className="flex gap-1.5 mt-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full bg-white/${20 - (i*4)}`}></div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}