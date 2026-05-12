import axios from 'axios';

// --- FUNGSI BANTUAN UPLOAD GAIB KE TELEGRA.PH (TANPA LIBRARY EXTERNAL) ---
async function uploadToTelegraph(base64Data) {
    try {
        const base64Image = base64Data.split(';base64,').pop();
        const buffer = Buffer.from(base64Image, 'base64');
        const blob = new Blob([buffer], { type: 'image/png' });
        
        const form = new FormData();
        form.append('file', blob, 'upload.png');
        
        const response = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: form
        });
        
        const data = await response.json();
        if (data && data[0] && data[0].src) {
            return 'https://telegra.ph' + data[0].src;
        }
        return null;
    } catch (error) { 
        return null; 
    }
}

export async function handleAI(req, res) {
    try {
        // --- PELINDUNG REQ.BODY ANTI CRASH ---
        let bodyData = {};
        if (req.body) {
            if (typeof req.body === 'object') {
                bodyData = req.body;
            } else {
                try { bodyData = JSON.parse(req.body); } catch(e) {}
            }
        }
        
        // 1. Gabungkan query dan body
        let params = { ...req.query, ...bodyData };
        
        // 2. KUNCI PERUBAHAN: Ambil 'type' secara manual dari URL 
        // Contoh: dari "/api/ai/deepseekr1?prompt=halo" kita potong jadi "deepseekr1"
        const type = req.url.split('?')[0].split('/').pop(); 
        
        const { prompt, system, temperature, q, text, cookie, promptSystem, imageUrl } = params;


        // --- PROSES GAMBAR KHUSUS GEMINI VISION ---
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
            const uploadedUrl = await uploadToTelegraph(imageUrl);
            if (uploadedUrl) {
                params.imageUrl = uploadedUrl;
            } else {
                return res.status(400).json({ status: false, message: "Gagal memproses unggahan gambar." });
            }
        }

        // ==========================================
        // KELOMPOK AI STANDAR
        // ==========================================
        const standardAI = ['deepseekr1', 'qwq32b', 'phi2', 'glm47flash', 'gptoss120b'];

        if (standardAI.includes(type)) {
            if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });
            
            let targetUrl = `https://api.siputzx.my.id/api/ai/${type}?prompt=${encodeURIComponent(prompt)}`;
            if (system) targetUrl += `&system=${encodeURIComponent(system)}`;
            if (temperature) targetUrl += `&temperature=${temperature}`;

            const response = await axios.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        
        // ==========================================
        // GITA (SPIRITUAL AI)
        // ==========================================
        else if (type === 'gita') {
            if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' wajib diisi!" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/ai/gita?q=${encodeURIComponent(q)}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }

        // ==========================================
        // GEMINI AI (DENGAN VISION)
        // ==========================================
        else if (type === 'gemini') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" });
            
            let targetUrl = `https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`;
            if (cookie) targetUrl += `&cookie=${encodeURIComponent(cookie)}`;
            if (promptSystem) targetUrl += `&promptSystem=${encodeURIComponent(promptSystem)}`;
            if (params.imageUrl) targetUrl += `&imageUrl=${encodeURIComponent(params.imageUrl)}`;

            const response = await axios.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        
        else {
            return res.status(400).json({ status: false, message: `Model AI '${type}' tidak ditemukan di sistem.` });
        }

    } catch (e) {
        // JIKA TERJADI ERROR, KEMBALIKAN JSON, BUKAN CRASH LAYAR HITAM!
        return res.status(500).json({ 
            status: false, 
            creator: "InuuTyzDev", 
            message: "API Provider Error: " + (e.response?.data?.message || e.message)
        });
    }
}
