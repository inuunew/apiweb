import axios from 'axios';

export async function handleStalker(req, res) {
    // POTONG URL SECARA MANUAL UNTUK MENDAPATKAN 'type'
    const type = req.url.split('?')[0].split('/').pop();
    
    // Menangkap parameter dari URL dashboard (tanpa 'type')
    const { q, user, username } = req.query;


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
            
            // --- TRIK SAPU BERSIH WATERMARK ---
            let cleanData = response.data.data || response.data;
            
            // Kita pastikan formatnya adalah objek sebelum menghapus datanya
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
        else {
            return res.status(400).json({ status: false, message: `Type stalker '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
