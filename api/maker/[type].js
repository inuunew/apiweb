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
                let params = { ...req.query };
                for (const key in fields) params[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                for (const key in files) params[key] = Array.isArray(files[key]) ? files[key][0] : files[key];

                const { type, text, text1, text2, text3, name, comment, ppurl, number, title, time, avatarUrl, image } = params;

                // --- 1. BRAT GENERATOR ---
                if (type === 'brat') {
                    if (!text) { res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" }); return resolve(); }
                    const targetUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
                    const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/png');
                    res.status(200).send(response.data);
                    return resolve();
                }

                // --- 2. E-KTP MAKER ---
                else if (type === 'ektp') {
                    const required = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan', 'image'];
                    for (const field of required) {
                        if (!params[field]) { res.status(400).json({ status: false, message: `Parameter '${field}' wajib diisi!` }); return resolve(); }
                    }

                    // Tentukan nilai default untuk param yang tidak dikirim UI
                    const golDarah = params.golongan_darah || '-';
                    const rtRw = params['rt/rw'] || '000/000';
                    const kelDesa = params['kel/desa'] || 'Desa';
                    const warganegara = params.kewarganegaraan || 'WNI';
                    const masaBerlaku = params.masa_berlaku || 'Seumur Hidup';
                    const terbuat = params.terbuat || '01-01-2024';

                    const isUploadingFile = files['image'] ? true : false;
                    let response;

                    if (isUploadingFile) {
                        // JALUR POST (FILE FISIK)
                        const axiosData = new FormData();
                        axiosData.append('provinsi', params.provinsi);
                        axiosData.append('kota', params.kota);
                        axiosData.append('nik', params.nik);
                        axiosData.append('nama', params.nama);
                        axiosData.append('ttl', params.ttl);
                        axiosData.append('jenis_kelamin', params.jenis_kelamin);
                        axiosData.append('golongan_darah', golDarah);
                        axiosData.append('alamat', params.alamat);
                        axiosData.append('rt/rw', rtRw);
                        axiosData.append('kel/desa', kelDesa);
                        axiosData.append('kecamatan', params.kecamatan);
                        axiosData.append('agama', params.agama);
                        axiosData.append('status', params.status);
                        axiosData.append('pekerjaan', params.pekerjaan);
                        axiosData.append('kewarganegaraan', warganegara);
                        axiosData.append('masa_berlaku', masaBerlaku);
                        axiosData.append('terbuat', terbuat);

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
                        // JALUR GET (URL TEKS) - MAPPING 'image' -> 'pas_photo'
                        const targetUrl = `https://api.siputzx.my.id/api/canvas/ektp?provinsi=${encodeURIComponent(params.provinsi)}&kota=${encodeURIComponent(params.kota)}&nik=${encodeURIComponent(params.nik)}&nama=${encodeURIComponent(params.nama)}&ttl=${encodeURIComponent(params.ttl)}&jenis_kelamin=${encodeURIComponent(params.jenis_kelamin)}&golongan_darah=${encodeURIComponent(golDarah)}&alamat=${encodeURIComponent(params.alamat)}&rt%2Frw=${encodeURIComponent(rtRw)}&kel%2Fdesa=${encodeURIComponent(kelDesa)}&kecamatan=${encodeURIComponent(params.kecamatan)}&agama=${encodeURIComponent(params.agama)}&status=${encodeURIComponent(params.status)}&pekerjaan=${encodeURIComponent(params.pekerjaan)}&kewarganegaraan=${encodeURIComponent(warganegara)}&masa_berlaku=${encodeURIComponent(masaBerlaku)}&terbuat=${encodeURIComponent(terbuat)}&pas_photo=${encodeURIComponent(params.image)}`;
                        
                        response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
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
                res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
                return resolve();
            }
        });
    });
}
