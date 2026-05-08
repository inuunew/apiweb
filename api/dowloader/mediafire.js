import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = req.query.url;

    if (!url || !url.includes('mediafire.com')) {
        return res.status(400).json({ status: false, message: 'URL Mediafire tidak valid!' });
    }

    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124' }
        });

        const $ = cheerio.load(data);
        const downloadLink = $('#downloadButton').attr('href');
        const fileName = $('.dl-btn-label').attr('title') || $('.promo-download-text').text().trim() || 'Unknown File';
        const rawButtonText = $('a#downloadButton').text();
        const fileSize = rawButtonText.replace(/Download|\(|\)/gi, '').trim() || 'Unknown Size';

        if (!downloadLink) throw new Error('Gagal menemukan link download.');

        res.status(200).json({
            status: true,
            creator: "Danzz",
            data: { file_name: fileName, file_size: fileSize, download_url: downloadLink, original_url: url }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Terjadi kesalahan saat memproses link Mediafire.' });
    }
}
