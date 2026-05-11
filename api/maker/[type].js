import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';

// Wajib dimatikan agar Vercel bisa menerima unggahan file foto (multipart/form-data)
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const apiKeyCuki = "cuki-x"; 

    // WAJIB BUNGKUS PROMISE AGAR VERCEL TIDAK TIMEOUT SAAT UPLOAD FOTO
    return new Promise((resolve) => {
        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ status: false, message: "Gagal memproses form data/file." });
                return resolve();
            }

            try {
                // Gabungkan query URL, form teks, dan file
                let params = { ...req.query };
                for (const key in fields) params[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                for (const key in files) params[key] = Array.isArray(files[key]) ? files[key][0] : files[key];

                const { type, text, text1, text2, text3, name, comment, ppurl, number, title, time, avatarUrl } = params;

                // --- 1. BRAT GENERATOR ---
                if (type === 'brat') {
                    if (!text) { res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" }); return resolve(); }
                    const targetUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
                    const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/png');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 2. E-KTP MAKER (MENDUKUNG POST FILE & GET URL) ---
                else if (type === 'ektp') {
                    // 👇 KUNCI PERUBAHAN: Backend mencari parameter 'image' (sesuai config.js) 👇
                    const required = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan', 'image'];
                    for (const field of required) {
                        if (!params[field]) { res.status(400).json({ status: false, message: `Parameter '${field}' wajib diisi!` }); return resolve(); }
                    }

                    const rt_rw = params['rt/rw'] || "000/000";
                    const kel_desa = params['kel/desa'] || "Desa";

                    const axiosData = new FormData();
                    
                    // Masukkan semua data teks ke FormData
                    axiosData.append('provinsi', params.provinsi);
                    axiosData.append('kota', params.kota);
                    axiosData.append('nik', params.nik);
                    axiosData.append('nama', params.nama);
                    axiosData.append('ttl', params.ttl);
                    axiosData.append('jenis_kelamin', params.jenis_kelamin);
                    axiosData.append('golongan_darah', params.golongan_darah || '-');
                    axiosData.append('alamat', params.alamat);
                    axiosData.append('rt/rw', rt_rw);
                    axiosData.append('kel/desa', kel_desa);
                    axiosData.append('kecamatan', params.kecamatan);
                    axiosData.append('agama', params.agama);
                    axiosData.append('status', params.status);
                    axiosData.append('pekerjaan', params.pekerjaan);
                    axiosData.append('kewarganegaraan', params.kewarganegaraan || 'WNI');
                    axiosData.append('masa_berlaku', params.masa_berlaku || 'Seumur Hidup');
                    axiosData.append('terbuat', params.terbuat || '01-01-2024');

                    // 👇 KUNCI PERUBAHAN: Backend mengecek unggahan file di kunci 'image' 👇
                    if (files['image']) {
                        const file = Array.isArray(files['image']) ? files['image'][0] : files['image'];
                        // Tetapi mengirimnya ke server Siputzx dengan nama 'pas_photo'
                        axiosData.append('pas_photo', fs.createReadStream(file.filepath), {
                            filename: file.originalFilename || 'pas_photo.jpg',
                            contentType: file.mimetype || 'image/jpeg'
                        });
                    } else {
                        // Jika berupa URL, ambil nilai dari params.image
                        axiosData.append('pas_photo', params.image);
                    }

                    // Tembak POST ke API E-KTP Siputzx
                    const response = await axios.post(`https://api.siputzx.my.id/api/canvas/ektp`, axiosData, {
                        headers: axiosData.getHeaders(),
                        responseType: 'arraybuffer'
                    });
                    
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 3. EPHOTO360 GRAFFITI ---
                else if (type === 'ephoto360') {
                    if (!text1) { res.status(400).json({ status: false, message: "Parameter 'text1' wajib diisi!" }); return resolve(); }
                    const template_url = "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html";
                    const payload = { url: template_url, text1, text2: text2 || "" };
                    const response = await axios.post("https://api.siputzx.my.id/api/m/ephoto360", payload, {
                        headers: { "Content-Type": "application/json" },
                        responseType: 'arraybuffer'
                    });
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 4. FB COMMAND (CANVAS) ---
                else if (type === 'fbcommand') {
                    if (!name || !comment || !ppurl) {
                        res.status(400).json({ status: false, message: "Parameter 'name', 'comment', dan 'ppurl' (Link Foto) wajib diisi!" });
                        return resolve();
                    }
                    const targetUrl = `https://api.cuki.biz.id/api/canvas/fbcommand?apikey=${apiKeyCuki}&name=${encodeURIComponent(name)}&comment=${encodeURIComponent(comment)}&ppurl=${encodeURIComponent(ppurl)}`;
                    const response = await axios.get(targetUrl, { headers: { 'x-api-key': apiKeyCuki }, responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/png');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 5. FAKE GROUP MAKER ---
                else if (type === 'fakegroup') {
                    if (!number || !title || !time || !avatarUrl) {
                        res.status(400).json({ status: false, message: "Parameter 'number', 'title', 'time', dan 'avatarUrl' wajib diisi!" });
                        return resolve();
                    }
                    const targetUrl = `https://api.cuki.biz.id/api/maker/fakegroup?apikey=${apiKeyCuki}&number=${number}&title=${encodeURIComponent(title)}&time=${time}&avatarUrl=${encodeURIComponent(avatarUrl)}`;
                    const response = await axios.get(targetUrl, { headers: { 'x-api-key': apiKeyCuki }, responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 6. ROASTING MAKER ---
                else if (type === 'roasting') {
                    if (!text1 || !text2 || !text3) {
                        res.status(400).json({ status: false, message: "Parameter 'teks1', 'teks2', dan 'teks3' wajib diisi!" });
                        return resolve();
                    }
                    const targetUrl = `https://api.cuki.biz.id/api/maker/roasting?apikey=${apiKeyCuki}&teks1=${encodeURIComponent(text1)}&teks2=${encodeURIComponent(text2)}&teks3=${encodeURIComponent(text3)}`;
                    const response = await axios.get(targetUrl, { headers: { 'x-api-key': apiKeyCuki }, responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.status(200).send(response.data);
                    return resolve();
                }

                else {
                    res.status(400).json({ status: false, message: `Type maker '${type}' tidak valid` });
                    return resolve();
                }
            } catch (e) {
                res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
                return resolve();
            }
        });
    });
}
