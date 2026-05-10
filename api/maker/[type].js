import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';

// --- MATIKAN BODY PARSER BAWAAN NEXT.JS ---
// Wajib dimatikan agar Vercel bisa menerima unggahan file foto (multipart/form-data)
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // 1. Mengatur CORS Headers & Preflight
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const apiKeyCuki = "cuki-x"; 

    // 2. Gunakan formidable untuk mem-parsing request (GET / POST)
    const form = formidable({ multiples: true, keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ status: false, message: "Gagal memproses form data/file." });

        try {
            // Gabungkan query URL, form teks, dan file menjadi satu objek `params`
            let params = { ...req.query };
            for (const key in fields) params[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
            for (const key in files) params[key] = Array.isArray(files[key]) ? files[key][0] : files[key];

            const { type, text, text1, text2, text3, name, comment, ppurl, number, title, time, avatarUrl } = params;

            // --- 1. BRAT GENERATOR ---
            if (type === 'brat') {
                if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" });
                const targetUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
                const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                res.setHeader('Content-Type', 'image/png');
                return res.status(200).send(response.data);
            }

            // --- 2. E-KTP MAKER (MENDUKUNG POST FILE & GET URL) ---
            else if (type === 'ektp') {
                const required = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan', 'pas_photo'];
                for (const field of required) {
                    if (!params[field]) return res.status(400).json({ status: false, message: `Parameter '${field}' wajib diisi!` });
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

                // Logika Pas Foto: Cek apakah user unggah file atau kirim teks URL
                if (files['pas_photo']) {
                    const file = Array.isArray(files['pas_photo']) ? files['pas_photo'][0] : files['pas_photo'];
                    axiosData.append('pas_photo', fs.createReadStream(file.filepath), {
                        filename: file.originalFilename || 'pas_photo.jpg',
                        contentType: file.mimetype || 'image/jpeg'
                    });
                } else {
                    axiosData.append('pas_photo', params.pas_photo);
                }

                const response = await axios.post(`https://api.siputzx.my.id/api/canvas/ektp`, axiosData, {
                    headers: axiosData.getHeaders(),
                    responseType: 'arraybuffer'
                });
                
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

            // --- 4. FB COMMAND (CANVAS) ---
            else if (type === 'fbcommand') {
                if (!name || !comment || !ppurl) {
                    return res.status(400).json({ status: false, message: "Parameter 'name', 'comment', dan 'ppurl' (Link Foto) wajib diisi!" });
                }
                const targetUrl = `https://api.cuki.biz.id/api/canvas/fbcommand?apikey=${apiKeyCuki}&name=${encodeURIComponent(name)}&comment=${encodeURIComponent(comment)}&ppurl=${encodeURIComponent(ppurl)}`;
                const response = await axios.get(targetUrl, { 
                    headers: { 'x-api-key': apiKeyCuki },
                    responseType: 'arraybuffer' 
                });
                res.setHeader('Content-Type', 'image/png');
                return res.status(200).send(response.data);
            }

            // --- 5. FAKE GROUP MAKER ---
            else if (type === 'fakegroup') {
                if (!number || !title || !time || !avatarUrl) {
                    return res.status(400).json({ status: false, message: "Parameter 'number', 'title', 'time', dan 'avatarUrl' wajib diisi!" });
                }
                const targetUrl = `https://api.cuki.biz.id/api/maker/fakegroup?apikey=${apiKeyCuki}&number=${number}&title=${encodeURIComponent(title)}&time=${time}&avatarUrl=${encodeURIComponent(avatarUrl)}`;
                const response = await axios.get(targetUrl, { 
                    headers: { 'x-api-key': apiKeyCuki },
                    responseType: 'arraybuffer' 
                });
                res.setHeader('Content-Type', 'image/jpeg');
                return res.status(200).send(response.data);
            }

            // --- 6. ROASTING MAKER ---
            else if (type === 'roasting') {
                if (!text1 || !text2 || !text3) {
                    return res.status(400).json({ status: false, message: "Parameter 'teks1', 'teks2', dan 'teks3' wajib diisi!" });
                }
                const targetUrl = `https://api.cuki.biz.id/api/maker/roasting?apikey=${apiKeyCuki}&teks1=${encodeURIComponent(text1)}&teks2=${encodeURIComponent(text2)}&teks3=${encodeURIComponent(text3)}`;
                const response = await axios.get(targetUrl, { 
                    headers: { 'x-api-key': apiKeyCuki },
                    responseType: 'arraybuffer' 
                });
                res.setHeader('Content-Type', 'image/jpeg');
                return res.status(200).send(response.data);
            }

            else {
                return res.status(400).json({ status: false, message: `Type maker '${type}' tidak valid` });
            }
        } catch (e) {
            return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
        }
    });
}
