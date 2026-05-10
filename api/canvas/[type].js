import axios from 'axios';

export default async function handler(req, res) {
    // 1. Mengatur CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { type } = req.query;

    // --- FUNGSI BANTUAN UNTUK FETCH GAMBAR ---
    // Fungsi ini menggantikan kode axios yang berulang-ulang di setiap blok if-else
    const sendCanvas = async (targetUrl) => {
        try {
            const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
            res.setHeader('Content-Type', 'image/png');
            return res.status(200).send(response.data);
        } catch (error) {
            return res.status(400).json({ status: false, creator: "InuuTyzDev", message: "Gagal memproses gambar dari provider." });
        }
    };

    try {
        // ==========================================
        // 1. SINGLE IMAGE MANIPULATION
        // ==========================================
        if (type === 'circle' || type === 'beautiful' || type === 'delete' || type === 'facepalm' || type === 'blur' || type === 'invert' || type === 'greyscale') {
            const { image } = req.query;
            if (!image) return res.status(400).json({ status: false, message: "Parameter 'image' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?image=${encodeURIComponent(image)}`);
        }
        
        else if (type === 'darkness') {
            const { image, amount } = req.query;
            if (!image || !amount) return res.status(400).json({ status: false, message: "Parameter 'image' dan 'amount' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/darkness?image=${encodeURIComponent(image)}&amount=${amount}`);
        }

        // ==========================================
        // 2. DUAL IMAGE MANIPULATION
        // ==========================================
        else if (type === 'batslap' || type === 'kiss') {
            const { image1, image2 } = req.query;
            if (!image1 || !image2) return res.status(400).json({ status: false, message: "Parameter 'image1' dan 'image2' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?image1=${encodeURIComponent(image1)}&image2=${encodeURIComponent(image2)}`);
        }

        // ==========================================
        // 3. TEXT & MEME
        // ==========================================
        else if (type === 'sertifikat-tolol') {
            const { text } = req.query;
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/sertifikat-tolol?text=${encodeURIComponent(text)}`);
        }
        else if (type === 'gay') {
            const { nama, avatar, num } = req.query;
            if (!nama || !avatar || !num) return res.status(400).json({ status: false, message: "Parameter 'nama', 'avatar', dan 'num' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/gay?nama=${encodeURIComponent(nama)}&avatar=${encodeURIComponent(avatar)}&num=${num}`);
        }

        // ==========================================
        // 4. WELCOME & GOODBYE CARDS
        // ==========================================
        else if (type === 'welcomev3' || type === 'goodbyev3') {
            const { username, avatar } = req.query;
            if (!username || !avatar) return res.status(400).json({ status: false, message: "Parameter 'username' dan 'avatar' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}`);
        }
        else if (type === 'welcomev4') {
            const { avatar, background, description } = req.query;
            if (!avatar || !background || !description) return res.status(400).json({ status: false, message: "Parameter 'avatar', 'background', dan 'description' wajib diisi!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(description)}`);
        }
        else if (type === 'welcomev2' || type === 'goodbyev2') {
            const { username, guildName, memberCount, avatar, background } = req.query;
            if (!username || !guildName || !avatar || !background) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(guildName)}&memberCount=${memberCount}&avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}`);
        }
        else if (type === 'welcomev5' || type === 'goodbyev5') {
            const { username, guildName, memberCount, avatar, background, quality } = req.query;
            if (!username || !guildName || !avatar || !background) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(guildName)}&memberCount=${memberCount}&avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&quality=${quality || 90}`);
        }
        else if (type === 'welcomev1' || type === 'goodbyev1') {
            const { username, guildName, guildIcon, memberCount, avatar, background, quality } = req.query;
            if (!username || !guildName || !avatar || !background || !guildIcon) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/${type}?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(guildName)}&guildIcon=${encodeURIComponent(guildIcon)}&memberCount=${memberCount}&avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&quality=${quality || 80}`);
        }
        else if (type === 'goodbyev4') {
            const { avatar, background, title, description, border, avatarBorder, overlayOpacity } = req.query;
            if (!avatar || !background || !title) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&border=${encodeURIComponent(border)}&avatarBorder=${encodeURIComponent(avatarBorder)}&overlayOpacity=${overlayOpacity}`);
        }

        // ==========================================
        // 5. RPG & SOCIAL CARDS
        // ==========================================
        else if (type === 'level-up') {
            const { backgroundURL, avatarURL, fromLevel, toLevel, name } = req.query;
            if (!backgroundURL || !avatarURL || !name) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/level-up?backgroundURL=${encodeURIComponent(backgroundURL)}&avatarURL=${encodeURIComponent(avatarURL)}&fromLevel=${fromLevel}&toLevel=${toLevel}&name=${encodeURIComponent(name)}`);
        }
        else if (type === 'profile') {
            const { backgroundURL, avatarURL, rankName, rankId, exp, requireExp, level, name } = req.query;
            if (!backgroundURL || !avatarURL || !name) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/profile?backgroundURL=${encodeURIComponent(backgroundURL)}&avatarURL=${encodeURIComponent(avatarURL)}&rankName=${encodeURIComponent(rankName)}&rankId=${rankId}&exp=${exp}&requireExp=${requireExp}&level=${level}&name=${encodeURIComponent(name)}`);
        }
        else if (type === 'ship') {
            const { avatar1, avatar2, background, persen } = req.query;
            if (!avatar1 || !avatar2 || !background) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/ship?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}&background=${encodeURIComponent(background)}&persen=${persen}`);
        }
        else if (type === 'tweet') {
            const { displayName, username, comment, avatar, verified, theme } = req.query;
            if (!displayName || !username || !comment || !avatar) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/tweet?displayName=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&comment=${encodeURIComponent(comment)}&avatar=${encodeURIComponent(avatar)}&verified=${verified || true}&theme=${theme || 'dark'}`);
        }
        else if (type === 'spotify') {
            const { title, artist, start, end, image, border } = req.query;
            if (!title || !artist || !image) return res.status(400).json({ status: false, message: "Data tidak lengkap!" });
            return await sendCanvas(`https://api.siputzx.my.id/api/canvas/spotify?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&start=${start}&end=${end}&image=${encodeURIComponent(image)}&border=${encodeURIComponent(border)}`);
        }
        else if (type === 'security') {
            const { avatar, background, createdTimestamp, suspectTimestamp, locale } = req.query;
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
