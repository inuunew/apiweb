import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';

// Wajib dimatikan agar Vercel bisa menerima unggahan file gambar (multipart/form-data)
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

    return new Promise((resolve) => {
        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ status: false, message: "Gagal memproses form data." });
                return resolve();
            }

            try {
                let params = { ...req.query };
                for (const key in fields) params[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                for (const key in files) params[key] = Array.isArray(files[key]) ? files[key][0] : files[key];

                const { type } = params;

                const sendCanvas = async (canvasType) => {
                    try {
                        if (canvasType === 'sertifikat-tolol') {
                            const response = await axios.post(`https://api.siputzx.my.id/api/canvas/${canvasType}`, 
                                { text: params.text }, 
                                { headers: { 'Content-Type': 'application/json' }, responseType: 'arraybuffer' }
                            );
                            res.setHeader('Content-Type', 'image/png');
                            res.status(200).send(response.data);
                            return resolve();
                        }

                        const hasFiles = Object.keys(files).length > 0;
                        let response;

                        if (hasFiles) {
                            // JALUR POST (FILE FISIK)
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
                            response = await axios.post(`https://api.siputzx.my.id/api/canvas/${canvasType}`, axiosData, {
                                headers: axiosData.getHeaders(),
                                responseType: 'arraybuffer' 
                            });
                        } else {
                            // JALUR GET (URL TEKS) - MAPPING 'image' -> 'url'
                            const queryString = new URLSearchParams();
                            for (const key in params) {
                                if (key === 'type') continue;
                                
                                let providerKey = key;
                                if (key === 'image') providerKey = 'url';
                                if (key === 'image1') providerKey = 'url1';
                                if (key === 'image2') providerKey = 'url2';
                                
                                queryString.append(providerKey, params[key]);
                            }
                            const targetUrl = `https://api.siputzx.my.id/api/canvas/${canvasType}?${queryString.toString()}`;
                            response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                        }

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
                // ==========================================

                if (['circle', 'beautiful', 'delete', 'facepalm', 'blur', 'invert', 'greyscale'].includes(type)) {
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
                else if (['welcomev3', 'goodbyev3'].includes(type)) {
                    const { username, avatar } = params;
                    if (!username || !avatar) { res.status(400).json({ status: false, message: "Parameter 'username' dan 'avatar' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                else if (type === 'welcomev4') {
                    const { avatar, background, description } = params;
                    if (!avatar || !background || !description) { res.status(400).json({ status: false, message: "Parameter 'avatar', 'background', dan 'description' wajib diisi!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                else if (['welcomev2', 'goodbyev2', 'welcomev5', 'goodbyev5'].includes(type)) {
                    const { username, guildName, memberCount, avatar, background } = params;
                    if (!username || !guildName || !avatar || !background) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                else if (['welcomev1', 'goodbyev1'].includes(type)) {
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
                    if (!title || !artist || !image) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                else if (type === 'security') {
                    const { avatar, background, createdTimestamp, suspectTimestamp, locale } = params;
                    if (!avatar || !background) { res.status(400).json({ status: false, message: "Data tidak lengkap!" }); return resolve(); }
                    return await sendCanvas(type);
                }
                else {
                    res.status(400).json({ status: false, creator: "InuuTyzDev", message: `Type canvas '${type}' tidak ditemukan di sistem.` });
                    return resolve();
                }

            } catch (e) {
                res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
                return resolve();
            }
        });
    });
}
