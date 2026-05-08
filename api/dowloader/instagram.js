import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = req.query.url || (req.body && req.body.url);

    if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' diperlukan." });

    try {
        const data = new URLSearchParams();
        data.append('url', url);
        data.append('v', '3');
        data.append('lang', 'en');

        const response = await axios.post('https://api.downloadgram.org/media', data.toString(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'referer': 'https://downloadgram.org/',
            }
        });

        const $ = cheerio.load(response.data);
        let result = {};

        if ($('video').length) {
            result.type = 'video';
            result.url = $('video source').attr('src');
            result.download_url = $('a[download]').attr('href');
            result.thumbnail = $('video').attr('poster');
        } else if ($('img').length) {
            result.type = 'image';
            result.url = $('img').attr('src');
            result.download_url = $('a[download]').attr('href');
        } else {
            throw new Error("Media tidak ditemukan. Pastikan akun tidak diprivate.");
        }

        for (let key in result) {
            if (result[key]) result[key] = result[key].replace(/\\\\"/g, '').replace(/\\"/g, '');
        }

        res.status(200).json({ status: true, creator: "Danzz", result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
