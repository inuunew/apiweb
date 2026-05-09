import axios from 'axios';

export default async function handler(req, res) {
    // Mengizinkan akses dari dashboard UI
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Mengambil parameter dari URL (Parameter 'url' sudah kita hapus karena akan di-hardcode)
    const { type, text, text1, text2 } = req.query;

    try {
        if (type === 'brat') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" });
            
            const targetUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
            const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
            
            res.setHeader('Content-Type', 'image/png');
            return res.status(200).send(response.data);
        }
        else if (type === 'ephoto360') {
            // Hanya butuh text1, tidak perlu lagi meminta url dari user
            if (!text1) {
                return res.status(400).json({ status: false, message: "Parameter 'text1' wajib diisi!" });
            }

            // --- HARDCODE URL TEMPLATE SESUAI PERMINTAAN ---
            const template_url = "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html";

            const payload = {
                url: template_url,
                text1: text1,
                text2: text2 || "" 
            };

            // Menembak API Siputzx dengan responseType: 'arraybuffer' untuk menangkap gambar asli
            const response = await axios.post("https://api.siputzx.my.id/api/m/ephoto360", payload, {
                headers: { "Content-Type": "application/json" },
                responseType: 'arraybuffer'
            });

            // Mengubah tipe konten menjadi gambar JPEG agar browser langsung menampilkannya sebagai foto
            res.setHeader('Content-Type', 'image/jpeg');
            return res.status(200).send(response.data);
        }
        else {
            return res.status(400).json({ status: false, message: `Type maker '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
