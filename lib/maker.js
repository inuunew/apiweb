import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';


export async function handleMaker(req, res) {
    const apiKeyCuki = "cuki-x"; 


    return new Promise((resolve) => {
        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ status: false, message: "Gagal memproses form data/file." });
                return resolve();
            }

            try {
                let params = { ...req.query };
                for (const key in fields) params[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                for (const key in files) params[key] = Array.isArray(files[key]) ? files[key][0] : files[key];

                // POTONG URL SECARA MANUAL
                const type = req.url.split('?')[0].split('/').pop();
                
                // 'type' dihapus dari sini:
                const { text, text1, text2, text3, name, comment, ppurl, number, title, time, avatarUrl, image } = params;


                // --- 1. BRAT GENERATOR ---
                if (type === 'brat') {
                    if (!text) { res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" }); return resolve(); }
                    const response = await axios.get(`https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/png');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 2. E-KTP MAKER (SMART PROXY: DOWNLOAD URL KE BUFFER) ---
                else if (type === 'ektp') {
                    const required = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan', 'image'];
                    for (const field of required) {
                        if (!params[field]) { res.status(400).json({ status: false, message: `Parameter '${field}' wajib diisi!` }); return resolve(); }
                    }

                    const axiosData = new FormData();
                    
                    const textFields = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan'];
                    textFields.forEach(f => axiosData.append(f, params[f]));

                    axiosData.append('golongan_darah', params.golongan_darah || '-');
                    axiosData.append('rt/rw', params['rt/rw'] || '000/000');
                    axiosData.append('kel/desa', params['kel/desa'] || 'Desa');
                    axiosData.append('kewarganegaraan', params.kewarganegaraan || 'WNI');
                    axiosData.append('masa_berlaku', params.masa_berlaku || 'Seumur Hidup');
                    axiosData.append('terbuat', params.terbuat || '01-01-2024');

                    // LOGIKA CERDAS: Selalu kirim file fisik ke Siputzx
                    if (files['image']) {
                        // Jika dari form file fisik
                        const file = Array.isArray(files['image']) ? files['image'][0] : files['image'];
                        axiosData.append('pas_photo', fs.createReadStream(file.filepath), { filename: 'pas_photo.jpg' });
                    } else if (params.image && params.image.startsWith('http')) {
                        // Jika dari URL teks, Vercel download dulu gambarnya!
                        const imgRes = await axios.get(params.image, { responseType: 'arraybuffer' });
                        axiosData.append('pas_photo', Buffer.from(imgRes.data), { filename: 'pas_photo.jpg' });
                    } else {
                        res.status(400).json({ status: false, message: "URL gambar tidak valid atau file kosong!" });
                        return resolve();
                    }

                    // Selalu tembak pakai POST agar Siputzx tidak 503
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
                    const payload = { url: "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html", text1, text2: text2 || "" };
                    const response = await axios.post("https://api.siputzx.my.id/api/m/ephoto360", payload, {
                        headers: { "Content-Type": "application/json" },
                        responseType: 'arraybuffer'
                    });
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 4, 5, 6 (FB, FAKEGROUP, ROASTING) ---
                else if (['fbcommand', 'fakegroup', 'roasting'].includes(type)) {
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
                res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Error: " + (e.response?.data?.message || e.message) });
                return resolve();
            }
        });
    });
}
