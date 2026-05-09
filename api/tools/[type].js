import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Menambahkan parameter 'query' dan 'country' untuk fitur baru
    const { type, url, device, domain, query, country } = req.query;

    try {
        if (type === 'shorturl') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `URL berhasil dipendekkan: ${url}` });
        } 
        else if (type === 'ssweb') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });

            const payload = { 
                url: url,
                device: device || "desktop" 
            };

            const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', payload, {
                headers: {
                    'content-type': 'application/json',
                    'referer': 'https://imagy.app/full-page-screenshot-taker/'
                }
            });

            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: data });
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
        // --- FITUR BARU: KODE POS ---
        else if (type === 'kodepos') {
            if (!query) return res.status(400).json({ status: false, message: "Parameter 'query' wajib diisi! (contoh: Lempuyang)" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/kodepos?form=${encodeURIComponent(query)}`);
            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data.data || response.data // Menangkap data array dari Siputzx
            });
        }
        // --- FITUR BARU: COUNTRY INFO ---
        else if (type === 'countryinfo') {
            if (!country) return res.status(400).json({ status: false, message: "Parameter 'country' wajib diisi! (contoh: Indonesia)" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(country)}`);
            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data.data || response.data
            });
        }
        else {
            return res.status(400).json({ status: false, message: `Type tools '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
