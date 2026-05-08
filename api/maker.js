import axios from 'axios';

export default async function handler(req, res) {
    // Mengizinkan akses dari dashboard UI
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Mengambil parameter dari URL
    const { type, text, text1, text2, url } = req.query;

    try {
        if (type === 'brat') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" });
            
            // Logika Brat Generator
            // (Nanti kalau kamu sudah punya API target untuk brat, tinggal masukkan axios di sini)
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                message: "Brat sukses diproses",
                result: `Membuat stiker dengan teks: ${text}` 
            });
        }
        else if (type === 'ephoto360') {
            // Validasi parameter wajib
            if (!url || !text1) {
                return res.status(400).json({ status: false, message: "Parameter 'url' dan 'text1' wajib diisi!" });
            }

            // Membangun payload JSON untuk dikirim ke API target
            const payload = {
                url: url,
                text1: text1,
                text2: text2 || "" // Jika text2 tidak diisi, otomatis menjadi string kosong
            };

            // Menembak API Siputzx menggunakan metode POST (seperti instruksi cURL-mu)
            const response = await axios.post("https://api.siputzx.my.id/api/m/ephoto360", payload, {
                headers: { "Content-Type": "application/json" }
            });

            // Meneruskan hasil gambar ke dashboard InuuTyzDev
            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data
            });
        }
        else {
            return res.status(400).json({ status: false, message: "Type maker tidak valid (gunakan brat atau ephoto360)" });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
