import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Menangkap semua parameter yang diperlukan
    const { type, q, channel } = req.query;

    try {
        // --- 1. INFO GEMPA BMKG TERKINI ---
        if (type === 'bmkg') {
            const response = await axios.get(`https://api.siputzx.my.id/api/info/bmkg`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: cleanData 
            });
        }
        // --- 2. INFO CUACA DAERAH ---
        else if (type === 'cuaca') {
            if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama lokasi) wajib diisi! (contoh: pasiran jaya)" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/info/cuaca?q=${encodeURIComponent(q)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: cleanData 
            });
        }
        // --- 3. JADWAL ACARA TV ---
        else if (type === 'jadwaltv') {
            if (!channel) return res.status(400).json({ status: false, message: "Parameter 'channel' wajib diisi! (contoh: gtv, rcti, antv)" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/info/jadwaltv?channel=${encodeURIComponent(channel)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: cleanData 
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
