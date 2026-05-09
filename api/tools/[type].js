import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { type, url, device, domain } = req.query;

    try {
        if (type === 'shorturl') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `URL berhasil dipendekkan: ${url}` });
        } 
        else if (type === 'ssweb') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });

            // --- LOGIKA SS WEB (IMAGY APP) ---
            // Kita siapkan payload dasar. Beberapa API SS juga mendeteksi kata 'mobile' dari parameter device
            const payload = { 
                url: url,
                // Jika imagy mendukung parameter jenis device, kita lempar juga ke sana
                device: device || "desktop" 
            };

            const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', payload, {
                headers: {
                    'content-type': 'application/json',
                    'referer': 'https://imagy.app/full-page-screenshot-taker/'
                }
            });

            // Meneruskan hasil JSON/Gambar dari Imagy ke dashboard InuuTyzDev
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: data 
            });
        } 
        else if (type === 'subdomain') {
            if (!domain) return res.status(400).json({ status: false, message: "Parameter 'domain' wajib diisi! (contoh: siputzx.my.id)" });
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains?domain=${domain}`);
            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data.data
            });
        }
        else {
            return res.status(400).json({ status: false, message: `Type tools '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
