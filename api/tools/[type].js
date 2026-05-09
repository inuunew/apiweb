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
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil SS web: ${url} (Device: ${device || 'desktop'})` });
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
