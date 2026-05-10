import axios from 'axios';
import FormData from 'form-data';

// --- FUNGSI BANTUAN UPLOAD GAIB KE TELEGRA.PH ---
async function uploadToTelegraph(base64Data) {
    try {
        const base64Image = base64Data.split(';base64,').pop();
        const buffer = Buffer.from(base64Image, 'base64');
        const form = new FormData();
        form.append('file', buffer, { filename: 'upload.png', contentType: 'image/png' });
        const response = await axios.post('https://telegra.ph/upload', form, { headers: form.getHeaders() });
        if (response.data && response.data[0] && response.data[0].src) {
            return 'https://telegra.ph' + response.data[0].src;
        }
        return null;
    } catch (error) { return null; }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Gabungkan query (dari GET) dan body (dari POST JSON)
    let params = { ...req.query, ...(req.body || {}) };
    const { type, prompt, system, temperature, q, text, cookie, promptSystem, imageUrl } = params;

    // --- PENDETEKSI GAMBAR (Base64 -> URL) KHUSUS GEMINI ---
    if (params.imageUrl && typeof params.imageUrl === 'string' && params.imageUrl.startsWith('data:image/')) {
        const uploadedUrl = await uploadToTelegraph(params.imageUrl);
        if (uploadedUrl) {
            params.imageUrl = uploadedUrl;
        } else {
            return res.status(400).json({ status: false, message: "Gagal mengupload gambar ke cloud." });
        }
    }

    try {
        const standardAI = ['deepseekr1', 'qwq32b', 'phi2', 'glm47flash', 'gptoss120b'];

        if (standardAI.includes(type)) {
            if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });
            
            let targetUrl = `https://api.siputzx.my.id/api/ai/${type}?prompt=${encodeURIComponent(prompt)}`;
            if (system) targetUrl += `&system=${encodeURIComponent(system)}`;
            if (temperature) targetUrl += `&temperature=${temperature}`;

            const response = await axios.get(targetUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });

            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        
        else if (type === 'gita') {
            if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' wajib diisi!" });
            const response = await axios.get(`https://api.siputzx.my.id/api/ai/gita?q=${encodeURIComponent(q)}`, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }

        else if (type === 'gemini') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" });
            
            let targetUrl = `https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`;
            if (cookie) targetUrl += `&cookie=${encodeURIComponent(cookie)}`;
            if (promptSystem) targetUrl += `&promptSystem=${encodeURIComponent(promptSystem)}`;
            if (params.imageUrl) targetUrl += `&imageUrl=${encodeURIComponent(params.imageUrl)}`;

            const response = await axios.get(targetUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });
            
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        
        else {
            return res.status(400).json({ status: false, message: `Model AI '${type}' tidak ditemukan.` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "API Target Error/Timeout: " + e.message });
    }
}
