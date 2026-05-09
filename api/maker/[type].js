import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Menangkap semua parameter yang mungkin dikirim
    const { 
        type, text, text1, text2, text3, 
        name, comment, ppurl, 
        number, title, time, avatarUrl,
        // Parameter khusus E-KTP
        provinsi, kota, nik, nama, ttl, jenis_kelamin, golongan_darah, alamat,
        kecamatan, agama, status, pekerjaan, kewarganegaraan, masa_berlaku, terbuat, pas_photo
    } = req.query;

    const apiKeyCuki = "cuki-x"; 

    try {
        // --- 1. BRAT GENERATOR ---
        if (type === 'brat') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" });
            const targetUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
            const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
            res.setHeader('Content-Type', 'image/png');
            return res.status(200).send(response.data);
        }

        // --- 2. E-KTP MAKER (NEW!) ---
        else if (type === 'ektp') {
            // Validasi field utama agar tidak kosong
            const required = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan', 'pas_photo'];
            for (const field of required) {
                if (!req.query[field]) return res.status(400).json({ status: false, message: `Parameter '${field}' wajib diisi!` });
            }

            // Menangani parameter dengan karakter khusus /
            const rt_rw = req.query['rt/rw'] || "000/000";
            const kel_desa = req.query['kel/desa'] || "Desa";

            const targetUrl = `https://api.siputzx.my.id/api/canvas/ektp?provinsi=${encodeURIComponent(provinsi)}&kota=${encodeURIComponent(kota)}&nik=${encodeURIComponent(nik)}&nama=${encodeURIComponent(nama)}&ttl=${encodeURIComponent(ttl)}&jenis_kelamin=${encodeURIComponent(jenis_kelamin)}&golongan_darah=${encodeURIComponent(golongan_darah || '-')}&alamat=${encodeURIComponent(alamat)}&rt%2Frw=${encodeURIComponent(rt_rw)}&kel%2Fdesa=${encodeURIComponent(kel_desa)}&kecamatan=${encodeURIComponent(kecamatan)}&agama=${encodeURIComponent(agama)}&status=${encodeURIComponent(status)}&pekerjaan=${encodeURIComponent(pekerjaan)}&kewarganegaraan=${encodeURIComponent(kewarganegaraan || 'WNI')}&masa_berlaku=${encodeURIComponent(masa_berlaku || 'Seumur Hidup')}&terbuat=${encodeURIComponent(terbuat || '01-01-2024')}&pas_photo=${encodeURIComponent(pas_photo)}`;

            const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
            res.setHeader('Content-Type', 'image/jpeg');
            return res.status(200).send(response.data);
        }

        // --- 3. EPHOTO360 GRAFFITI ---
        else if (type === 'ephoto360') {
            if (!text1) return res.status(400).json({ status: false, message: "Parameter 'text1' wajib diisi!" });
            const template_url = "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html";
            const payload = { url: template_url, text1, text2: text2 || "" };
            const response = await axios.post("https://api.siputzx.my.id/api/m/ephoto360", payload, {
                headers: { "Content-Type": "application/json" },
                responseType: 'arraybuffer'
            });
            res.setHeader('Content-Type', 'image/jpeg');
            return res.status(200).send(response.data);
        }

        // --- LOGIKA MAKER LAINNYA (Cuki Biz, dll) ---
        // (Tetap pertahankan logika fbcommand, fakegroup, dan roasting di sini)
        // ... (kode sebelumnya)

        else {
            return res.status(400).json({ status: false, message: `Type maker '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
