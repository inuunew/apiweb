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

                const { type, text, text1, text2, text3, name, comment, ppurl, number, title, time, avatarUrl, image } = params;

                // --- 1. BRAT GENERATOR ---
                if (type === 'brat') {
                    if (!text) { res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" }); return resolve(); }
                    const response = await axios.get(`https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/png');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 2. E-KTP MAKER (LOGIKA PINTAR: FILE/URL) ---
                else if (type === 'ektp') {
                    const required = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan', 'image'];
                    for (const field of required) {
                        if (!params[field]) { res.status(400).json({ status: false, message: `Parameter '${field}' wajib diisi!` }); return resolve(); }
                    }

                    // Cek apakah user mengunggah file fisik di parameter 'image'
                    const isUploadingFile = files['image'] ? true : false;
                    let response;

                    if (isUploadingFile) {
                        // JALUR POST (FILE FISIK)
                        const axiosData = new FormData();
                        // Append semua parameter teks
                        const textFields = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan'];
                        textFields.forEach(f => axiosData.append(f, params[f]));
                        axiosData.append('golongan_darah', params.golongan_darah || '-');
                        axiosData.append('rt/rw', params['rt/rw'] || "000/000");
                        axiosData.append('kel/desa', params['kel/desa'] || "Desa");
                        axiosData.append('kewarganegaraan', params.kewarganegaraan || 'WNI');
                        axiosData.append('masa_berlaku', params.masa_berlaku || 'Seumur Hidup');
                        axiosData.append('terbuat', params.terbuat || '01-01-2024');

                        // Masukkan file fisik sebagai 'pas_photo' (nama asli di API Siputzx)
                        const file = Array.isArray(files['image']) ? files['image'][0] : files['image'];
                        axiosData.append('pas_photo', fs.createReadStream(file.filepath), {
                            filename: file.originalFilename || 'pas_photo.jpg',
                            contentType: file.mimetype || 'image/jpeg'
                        });

                        response = await axios.post(`https://api.siputzx.my.id/api/canvas/ektp`, axiosData, {
                            headers: axiosData.getHeaders(),
                            responseType: 'arraybuffer'
                        });
                    } else {
                        // JALUR GET (TEKS URL)
                        const queryParams = new URLSearchParams();
                        for (const key in params) {
                            if (key === 'type') continue;
                            if (key === 'image') {
                                queryParams.append('pas_photo', params[key]); // Map 'image' ke 'pas_photo'
                            } else {
                                queryParams.append(key, params[key]);
                            }
                        }
                        response = await axios.get(`https://api.siputzx.my.id/api/canvas/ektp?${queryParams.toString()}`, {
                            responseType: 'arraybuffer'
                        });
                    }
                    
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 3. EPHOTO360 GRAFFITI ---
                else if (type === 'ephoto360') {
                    if (!text1) { res.status(400).json({ status: false, message: "Parameter 'text1' wajib diisi!" }); return resolve(); }
                    const payload = { url: "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html", text1, text2: text2 || "" };
                    const response = await axios.post("https://api.siputzx.my.id/api/m/ephoto360", payload, {
                        headers: { "Content-Type": "application/json" },
                        responseType: 'arraybuffer'
                    });
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 4, 5, 6 (FB, FAKEGROUP, ROASTING) TETAP PAKAI GET CUKI ---
                else if (['fbcommand', 'fakegroup', 'roasting'].includes(type)) {
                    // Logic lama kamu yang stabil...
                    let targetUrl = `https://api.cuki.biz.id/api/${type === 'fbcommand' ? 'canvas' : 'maker'}/${type}?apikey=${apiKeyCuki}`;
                    for(let key in params) if(!['type'].includes(key)) targetUrl += `&${key}=${encodeURIComponent(params[key])}`;
                    
                    const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', type === 'fbcommand' ? 'image/png' : 'image/jpeg');
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
