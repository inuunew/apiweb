import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Menangkap semua parameter yang diperlukan
    const { type, q, channel } = req.query;

    try {
        // --- 1. INFO GEMPA BMKG TERKINI ---
        if (type === 'bmkg') {
            const response = await axios.get(`https://api.siputzx.my.id/api/info/bmkg`);
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: response.data.data || response.data 
            });
        }
        // --- 2. INFO CUACA DAERAH ---
        else if (type === 'cuaca') {
            if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama lokasi) wajib diisi! (contoh: pasiran jaya)" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/info/cuaca?q=${encodeURIComponent(q)}`);
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: response.data.data || response.data 
            });
        }
        // --- 3. JADWAL ACARA TV ---
        else if (type === 'jadwaltv') {
            if (!channel) return res.status(400).json({ status: false, message: "Parameter 'channel' wajib diisi! (contoh: gtv, rcti, antv)" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/info/jadwaltv?channel=${encodeURIComponent(channel)}`);
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: response.data.data || response.data 
            });
        }
        // --- ERROR HANDLING ---
        else {
            return res.status(400).json({ status: false, message: `Type info '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
