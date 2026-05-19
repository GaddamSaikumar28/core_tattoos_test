
import { NextResponse } from 'next/server';

// Toggle default provider here: 'huggingface' (Free), 'gemini' (Paid), or 'openai' (Paid)
const DEFAULT_PROVIDER = process.env.IMAGE_PROVIDER || 'huggingface';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, provider = DEFAULT_PROVIDER } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // ==========================================
    // OPTION 1: GOOGLE GEMINI (Requires Paid Billing Tier)
    // ==========================================
    if (provider === 'gemini') {
      const API_KEY = process.env.GEMINI_API_KEY; 
      if (!API_KEY) {
        return NextResponse.json({ error: "Gemini API Key is missing from env variables" }, { status: 500 });
      }

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        return NextResponse.json({ 
          error: "Gemini image generation requires an active paid billing account in AI Studio.",
          details: errorText 
        }, { status: response.status });
      }

      const data = await response.json();
      const part = data.candidates?.[0]?.content?.parts?.[0];
      
      if (part?.inlineData?.data) {
        const base64Image = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return NextResponse.json({ 
          success: true, 
          imageUrl: `data:${mimeType};base64,${base64Image}` 
        });
      }
      throw new Error("No image data returned from Gemini");
    }

    // ==========================================
    // OPTION 2: HUGGING FACE (100% Free Alternative)
    // ==========================================
    // if (provider === 'huggingface') {
    //   const HF_API_KEY = process.env.HF_API_KEY; 
      
    //   // FIX 1: Guard against missing token before shooting the request
    //   if (!HF_API_KEY) {
    //     return NextResponse.json({ error: "Hugging Face API token is missing from env variables" }, { status: 500 });
    //   }
      
    //   // Using Stable Diffusion XL (Excellent for tattoo designs)
    //   const MODEL = "stabilityai/stable-diffusion-xl-base-1.0"; 
      
    //   const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
    //     method: "POST",
    //     headers: {
    //       "Authorization": `Bearer ${HF_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ inputs: prompt }),
    //   });

    //   if (!response.ok) {
    //     const errText = await response.text();
    //     throw new Error(`Hugging Face API error: ${errText}`);
    //   }

    //   // Hugging Face returns raw binary data
    //   const arrayBuffer = await response.arrayBuffer();
    //   const buffer = Buffer.from(arrayBuffer);
    //   const base64Image = buffer.toString('base64');
      
    //   return NextResponse.json({ 
    //     success: true, 
    //     imageUrl: `data:image/jpeg;base64,${base64Image}` 
    //   });
    // }

    if (provider === 'huggingface') {
      const HF_API_KEY = process.env.HF_API_KEY; 
      
      if (!HF_API_KEY) {
        return NextResponse.json({ error: "Hugging Face API token is missing from env variables" }, { status: 500 });
      }
      
      // FLUX.1-schnell produces world-class, ultra-sharp tattoo designs
      const MODEL = "black-forest-labs/FLUX.1-schnell"; 
      
      // FIX: Use the standardized hf-inference router domain to resolve the 'Cannot POST' route error
      const HF_ROUTER_URL = `https://router.huggingface.co/hf-inference/models/${MODEL}`;

      console.log(`Requesting image from Hugging Face Router for model: ${MODEL}`);

      const response = await fetch(HF_ROUTER_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("HF Details:", errText);
        throw new Error(`Hugging Face API error (${response.status}): ${errText}`);
      }

      // Hugging Face returns raw binary data
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString('base64');
      
      return NextResponse.json({ 
        success: true, 
        imageUrl: `data:image/jpeg;base64,${base64Image}` 
      });
    }

    // ==========================================
    // OPTION 3: OPENAI DALL-E 3 (Paid Alternative)
    // ==========================================
    if (provider === 'openai') {
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        return NextResponse.json({ error: "OpenAI API Key is missing from env variables" }, { status: 500 });
      }

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json" // FIX 2: Returns permanent base64 instead of temporary links
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API error: ${errText}`);
      }

      const data = await response.json();
      const base64Image = data.data[0].b64_json;
      
      return NextResponse.json({ 
        success: true, 
        imageUrl: `data:image/png;base64,${base64Image}` 
      });
    }

    return NextResponse.json({ error: "Invalid provider specified" }, { status: 400 });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}