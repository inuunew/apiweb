import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Menangkap parameter dari URL dashboard
    const { type, q, user, username } = req.query;

    // Trik menyatukan target pencarian agar kode lebih bersih
    const target = q || user || username;

    if (!target) return res.status(400).json({ status: false, message: "Parameter username/target wajib diisi!" });

    try {
        // Daftar layanan stalker yang tersedia
        const validTypes = ['pinterest', 'twitter', 'github', 'youtube', 'threads'];

        if (validTypes.includes(type)) {
            // Menyesuaikan nama parameter (q, user, username) sesuai permintaan server Siputzx
            let paramName = 'q';
            if (type === 'twitter' || type === 'github') paramName = 'user';
            if (type === 'youtube') paramName = 'username';

            // Membangun URL target secara dinamis
            const targetUrl = `https://api.siputzx.my.id/api/stalk/${type}?${paramName}=${encodeURIComponent(target)}`;
            
            // Eksekusi penarikan data
            const response = await axios.get(targetUrl);
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: response.data.data || response.data // Menangkap objek data dari Siputzx
            });
        } 
        else {
            return res.status(400).json({ status: false, message: `Type stalker '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
