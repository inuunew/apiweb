import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Vercel akan otomatis mengisi variabel "type" ini dari nama rute URL-nya!
    const { type, text, text1, text2, url } = req.query;

    try {
        if (type === 'brat') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" });
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                message: "Brat sukses diproses",
                result: `Membuat stiker dengan teks: ${text}` 
            });
        }
        else if (type === 'ephoto360') {
            if (!url || !text1) {
                return res.status(400).json({ status: false, message: "Parameter 'url' dan 'text1' wajib diisi!" });
            }

            const payload = {
                url: url,
                text1: text1,
                text2: text2 || ""
            };

            const response = await axios.post("https://api.siputzx.my.id/api/m/ephoto360", payload, {
                headers: { "Content-Type": "application/json" }
            });

            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data
            });
        }
        else {
            return res.status(400).json({ status: false, message: `Type maker '${type}' tidak valid (gunakan brat atau ephoto360)` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
