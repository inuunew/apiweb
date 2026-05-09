import axios from 'axios';

export default async function handler(req, res) {
    // Mengizinkan akses dari dashboard UI
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Mengambil parameter dari URL
    const { type, text, text1, text2, url } = req.query;

    try {
        if (type === 'brat') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" });
            
            // --- LOGIKA BRAT (DIRECT IMAGE) ---
            const targetUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
            
            // Menyedot gambar dari API target dalam bentuk data mentah (buffer)
            const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
            
            // Mengubah tipe konten menjadi gambar agar browser menampilkannya sebagai foto
            res.setHeader('Content-Type', 'image/png');
            return res.status(200).send(response.data);
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

            // Ephoto360 tetap merespons dengan JSON standar
            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data
            });
        }
        else {
            return res.status(400).json({ status: false, message: `Type maker '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
