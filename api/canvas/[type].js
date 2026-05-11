import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';

// --- MATIKAN BODY PARSER BAWAAN NEXT.JS ---
// Wajib dimatikan agar Vercel bisa menerima unggahan file gambar (multipart/form-data)
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

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. WAJIB BUNGKUS DENGAN PROMISE UNTUK VERCEL
    // Agar serverless tidak mati sebelum proses selesai
    return new Promise((resolve) => {
        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ status: false, message: "Gagal memproses form data." });
                return resolve();
            }

            try {
                // --- GABUNGKAN DATA QUERY, TEKS, DAN FILE ---
                let params = { ...req.query };
                for (const key in fields) params[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                for (const key in files) params[key] = Array.isArray(files[key]) ? files[key][0] : files[key];

                const { type } = params;

                // --- FUNGSI BANTUAN UNTUK FETCH KE SIPUTZX ---
                const sendCanvas = async (canvasType) => {
                    try {
                        // Khusus sertifikat-tolol (harus JSON)
                        if (canvasType === 'sertifikat-tolol') {
                            const response = await axios.post(`https://api.siputzx.my.id/api/canvas/${canvasType}`, 
                                { text: params.text }, 
                                { headers: { 'Content-Type': 'application/json' }, responseType: 'arraybuffer' }
                            );
                            res.setHeader('Content-Type', 'image/png');
                            res.status(200).send(response.data);
                            return resolve();
                        }

                        // Selain itu, gunakan FormData untuk gambar
                        const axiosData = new FormData();
                        for (const key in params) {
                            if (key === 'type') continue;

                            if (files[key]) {
                                const file = Array.isArray(files[key]) ? files[key][0] : files[key];
                                axiosData.append(key, fs.createReadStream(file.filepath), {
                                    filename: file.originalFilename || `${key}.png`,
                                    contentType: file.mimetype || 'image/png'
                                });
                            } else if (params[key]) {
                                axiosData.append(key, params[key]);
                            }
                        }

                        const response = await axios.post(`https://api.siputzx.my.id/api/canvas/${canvasType}`, axiosData, {
                            headers: axiosData.getHeaders(),
                            responseType: 'arraybuffer' 
                        });

                        res.setHeader('Content-Type', 'image/png');
                        res.status(200).send(response.data);
                        return resolve();

                    } catch (error) {
                        res.status(400).json({ 
                            status: false, 
                            creator: "InuuTyzDev", 
                            message: "Gagal memproses gambar dari provider: " + (error.response?.data?.message || error.message) 
                        });
                        return resolve();
                    }
                };

                // ==========================================
                // LOGIKA VALIDASI FULL CANVAS
                // Pastikan menggunakan resolve() pengganti return res
                // ==========================================

                if (type === 'circle' || type === 'beautiful' || type === 'delete' || type === 'facepalm' || type === 'blur' || type === 'invert' || type === 'greyscale') {
                    const { image } = params;
                    if (!image) { res.status(400).json({ status: false, message: "Parameter 'image' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'darkness') {
                    const { image, amount } = params;
                    if (!image || !amount) { res.status(400).json({ status: false, message: "Parameter 'image' dan 'amount' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }

                else if (type === 'batslap' || type === 'kiss') {
                    const { image1, image2 } = params;
                    if (!image1 || !image2) { res.status(400).json({ status: false, message: "Parameter 'image1' dan 'image2' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }

                else if (type === 'sertifikat-tolol') {
                    const { text } = params;
                    if (!text) { res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'gay') {
                    const { nama, avatar, num } = params;
                    if (!nama || !avatar || !num) { res.status(400).json({ status: false, message: "Parameter 'nama', 'avatar', dan 'num' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }

                else if (type === 'welcomev3' || type === 'goodbyev3') {
                    const { username, avatar } = params;
                    if (!username || !avatar) { res.status(400).json({ status: false, message: "Parameter 'username' dan 'avatar' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'welcomev4') {
                    const { avatar, background, description } = params;
                    if (!avatar || !background || !description) { res.status(400).json({ status: false, message: "Parameter 'avatar', 'background', dan 'description' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'welcomev2' || type === 'goodbyev2') {
                    const { username, guildName, memberCount, avatar, background } = params;
                    if (!username || !guildName || !avatar || !background) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'welcomev5' || type === 'goodbyev5') {
                    const { username, guildName, memberCount, avatar, background } = params;
                    if (!username || !guildName || !avatar || !background) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'welcomev1' || type === 'goodbyev1') {
                    const { username, guildName, guildIcon, memberCount, avatar, background } = params;
                    if (!username || !guildName || !avatar || !background || !guildIcon) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'goodbyev4') {
                    const { avatar, background, title, description, border, avatarBorder, overlayOpacity } = params;
                    if (!avatar || !background || !title) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }

                else if (type === 'level-up') {
                    const { backgroundURL, avatarURL, fromLevel, toLevel, name } = params;
                    if (!backgroundURL || !avatarURL || !name) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'profile') {
                    const { backgroundURL, avatarURL, rankName, rankId, exp, requireExp, level, name } = params;
                    if (!backgroundURL || !avatarURL || !name) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'ship') {
                    const { avatar1, avatar2, background, persen } = params;
                    if (!avatar1 || !avatar2 || !background) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'tweet') {
                    const { displayName, username, comment, avatar } = params;
                    if (!displayName || !username || !comment || !avatar) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'spotify') {
                    const { title, artist, start, end, image } = params;
                    // 'border' boleh kosong, ikut standar
                    if (!title || !artist || !image) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                
                else if (type === 'security') {
                    const { avatar, background, createdTimestamp, suspectTimestamp, locale } = params;
                    if (!avatar || !background) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }

                // ==========================================
                // ERROR HANDLER DEFAULT
                // ==========================================
                else {
                    res.status(400).json({ 
                        status: false, 
                        creator: "InuuTyzDev",
                        message: `Type canvas '${type}' tidak ditemukan di sistem.` 
                    });
                    return resolve();
                }

            } catch (e) {
                res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
                return resolve();
            }
        });
    });
}
