import axios from 'axios';
import FormData from 'form-data';

// --- MENGAKALI BATAS UKURAN VERCEL (MAKSIMAL 10MB) ---
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

// --- FUNGSI BANTUAN UPLOAD GAIB KE CATBOX (LEBIH STABIL) ---
async function uploadImage(base64Data) {
    try {
        const base64Image = base64Data.split(';base64,').pop();
        const buffer = Buffer.from(base64Image, 'base64');
        
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', buffer, { filename: 'upload.png', contentType: 'image/png' });
        
        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });
        
        return response.data; // Catbox langsung merespon dengan text URL
    } catch (error) { 
        throw new Error(error.message);
    }
}

export default async function handler(req, res) {
    // 1. Mengatur CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // --- PELINDUNG REQ.BODY ANTI CRASH ---
        let bodyData = {};
        if (req.body) {
            if (typeof req.body === 'object') bodyData = req.body;
            else try { bodyData = JSON.parse(req.body); } catch(e) {}
        }

        // Gabungkan query (GET) dan body (POST)
        let params = { ...req.query, ...bodyData };
        const { type } = params;

        // --- PROSES UPLOAD GAMBAR BASE64 -> URL ---
        for (const key of Object.keys(params)) {
            if (typeof params[key] === 'string' && params[key].startsWith('data:image/')) {
                try {
                    const uploadedUrl = await uploadImage(params[key]);
                    params[key] = uploadedUrl;
                } catch (err) {
                    return res.status(400).json({ status: false, message: `Gagal upload cloud untuk parameter '${key}': ${err.message}` });
                }
            }
        }

        // --- FUNGSI BANTUAN UNTUK FETCH GAMBAR KE SIPUTZX ---
        const sendCanvas = async (targetUrl) => {
            try {
                const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                res.setHeader('Content-Type', 'image/png');
                return res.status(200).send(response.data);
            } catch (error) {
                return res.status(400).json({ status: false, creator: "InuuTyzDev", message: "Gagal memproses gambar dari provider." });
            }
        };

        // ==========================================
        // 1. SINGLE IMAGE MANIPULATION
        // ==========================================
        if (type === 'circle' || type === 'beautiful' || type === 'delete' || type === 'facepalm' || type === 'blur' || type === 'invert' || type === 'greyscale') {
            const { image } = params;
            if (!image) return res.status(400).json({ status: false, message: "Parameter 'image' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?image=${encodeURIComponent(image)}`);
        }
        
        else if (type === 'darkness') {
            const { image, amount } = params;
            if (!image || !amount) return res.status(400).json({ status: false, message: "Parameter 'image' dan 'amount' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/darkness?image=${encodeURIComponent(image)}&amount=${amount}`);
        }

        // ==========================================
        // 2. DUAL IMAGE MANIPULATION
        // ==========================================
        else if (type === 'batslap' || type === 'kiss') {
            const { image1, image2 } = params;
            if (!image1 || !image2) return res.status(400).json({ status: false, message: "Parameter 'image1' dan 'image2' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?image1=${encodeURIComponent(image1)}&image2=${encodeURIComponent(image2)}`);
        }

        // ==========================================
        // 3. TEXT & MEME
        // ==========================================
        else if (type === 'sertifikat-tolol') {
            const { text } = params;
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/sertifikat-tolol?text=${encodeURIComponent(text)}`);
        }
        else if (type === 'gay') {
            const { nama, avatar, num } = params;
            if (!nama || !avatar || !num) return res.status(400).json({ status: false, message: "Parameter 'nama', 'avatar', dan 'num' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/gay?nama=${encodeURIComponent(nama)}&avatar=${encodeURIComponent(avatar)}&num=${num}`);
        }

        // ==========================================
        // 4. WELCOME & GOODBYE CARDS
        // ==========================================
        else if (type === 'welcomev3' || type === 'goodbyev3') {
            const { username, avatar } = params;
            if (!username || !avatar) return res.status(400).json({ status: false, message: "Parameter 'username' dan 'avatar' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}`);
        }
        else if (type === 'welcomev4') {
            const { avatar, background, description } = params;
            if (!avatar || !background || !description) return res.status(400).json({ status: false, message: "Parameter 'avatar', 'background', dan 'description' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(description)}`);
        }
        else if (type === 'welcomev2' || type === 'goodbyev2') {
            const { username, guildName, memberCount, avatar, background } = params;
            if (!username || !guildName || !avatar || !background) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(guildName)}&memberCount=${memberCount}&avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}`);
        }
        else if (type === 'welcomev5' || type === 'goodbyev5') {
            const { username, guildName, memberCount, avatar, background, quality } = params;
            if (!username || !guildName || !avatar || !background) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(guildName)}&memberCount=${memberCount}&avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&quality=${quality || 90}`);
        }
        else if (type === 'welcomev1' || type === 'goodbyev1') {
            const { username, guildName, guildIcon, memberCount, avatar, background, quality } = params;
            if (!username || !guildName || !avatar || !background || !guildIcon) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(guildName)}&guildIcon=${encodeURIComponent(guildIcon)}&memberCount=${memberCount}&avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&quality=${quality || 80}`);
        }
        else if (type === 'goodbyev4') {
            const { avatar, background, title, description, border, avatarBorder, overlayOpacity } = params;
            if (!avatar || !background || !title) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&border=${encodeURIComponent(border)}&avatarBorder=${encodeURIComponent(avatarBorder)}&overlayOpacity=${overlayOpacity}`);
        }

        // ==========================================
        // 5. RPG & SOCIAL CARDS
        // ==========================================
        else if (type === 'level-up') {
            const { backgroundURL, avatarURL, fromLevel, toLevel, name } = params;
            if (!backgroundURL || !avatarURL || !name) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/level-up?backgroundURL=${encodeURIComponent(backgroundURL)}&avatarURL=${encodeURIComponent(avatarURL)}&fromLevel=${fromLevel}&toLevel=${toLevel}&name=${encodeURIComponent(name)}`);
        }
        else if (type === 'profile') {
            const { backgroundURL, avatarURL, rankName, rankId, exp, requireExp, level, name } = params;
            if (!backgroundURL || !avatarURL || !name) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/profile?backgroundURL=${encodeURIComponent(backgroundURL)}&avatarURL=${encodeURIComponent(avatarURL)}&rankName=${encodeURIComponent(rankName)}&rankId=${rankId}&exp=${exp}&requireExp=${requireExp}&level=${level}&name=${encodeURIComponent(name)}`);
        }
        else if (type === 'ship') {
            const { avatar1, avatar2, background, persen } = params;
            if (!avatar1 || !avatar2 || !background) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/ship?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}&background=${encodeURIComponent(background)}&persen=${persen}`);
        }
        else if (type === 'tweet') {
            const { displayName, username, comment, avatar, verified, theme } = params;
            if (!displayName || !username || !comment || !avatar) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/tweet?displayName=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&comment=${encodeURIComponent(comment)}&avatar=${encodeURIComponent(avatar)}&verified=${verified || true}&theme=${theme || 'dark'}`);
        }
        else if (type === 'spotify') {
            const { title, artist, start, end, image, border } = params;
            if (!title || !artist || !image) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/spotify?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&start=${start}&end=${end}&image=${encodeURIComponent(image)}&border=${encodeURIComponent(border)}`);
        }
        else if (type === 'security') {
            const { avatar, background, createdTimestamp, suspectTimestamp, locale } = params;
            if (!avatar || !background) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/security?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&createdTimestamp=${createdTimestamp}&suspectTimestamp=${suspectTimestamp}&locale=${locale}`);
        }

        // ==========================================
        // ERROR HANDLER
        // ==========================================
        else {
            return res.status(400).json({ 
                status: false, 
                creator: "InuuTyzDev",
                message: `Type canvas '${type}' tidak ditemukan di sistem.` 
            });
        }

    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
