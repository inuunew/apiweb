import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Mengambil semua kemungkinan parameter dari URL
    const { type, prompt, system, temperature, q, text, cookie, promptSystem, imageUrl } = req.query;

    try {
        // --- KELOMPOK MODEL AI STANDAR ---
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
        
        // --- MODEL AI KHUSUS: GITA ---
        else if (type === 'gita') {
            if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' wajib diisi!" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/ai/gita?q=${encodeURIComponent(q)}`, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }

        // --- MODEL AI KHUSUS: GEMINI ---
        else if (type === 'gemini') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" });
            
            let targetUrl = `https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`;
            if (cookie) targetUrl += `&cookie=${encodeURIComponent(cookie)}`;
            if (promptSystem) targetUrl += `&promptSystem=${encodeURIComponent(promptSystem)}`;
            if (imageUrl) targetUrl += `&imageurl=${encodeURIComponent(imageUrl)}`; // Tambahan untuk Vision AI

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
        // Menangkap error jika Vercel terpotong Timeout atau API mati
        return res.status(500).json({ 
            status: false, 
            creator: "InuuTyzDev", 
            message: "API Target Error/Timeout: " + e.message 
        });
    }
}

        
        else {
            return res.status(400).json({ status: false, message: `Model AI '${type}' tidak ditemukan.` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
