import axios from 'axios';
import * as cheerio from 'cheerio';

// Logika Downloader akan dipilih berdasarkan parameter "type"
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { type, url } = req.query;

    if (!url) return res.status(400).json({ status: false, message: "URL required" });

    try {
        if (type === 'fb') {
            // Logika Facebook
            const { data } = await axios.get('https://fdown.net');
            const $ = cheerio.load(data);
            const tokens = { v: $('input[name="token_v"]').val(), c: $('input[name="token_c"]').val(), h: $('input[name="token_h"]').val() };
            const postData = new URLSearchParams({ 'URLz': url, 'token_v': tokens.v, 'token_c': tokens.c, 'token_h': tokens.h });
            const resDl = await axios.post('https://fdown.net/download.php', postData.toString());
            const $$ = cheerio.load(resDl.data);
            res.json({ status: true, creator: "InuuTyzDev", result: { sd: $$('#sdlink').attr('href'), hd: $$('#hdlink').attr('href') }});
        } 
        else if (type === 'ig') {
            // Logika Instagram
            const data = new URLSearchParams({ url, v: '3', lang: 'en' });
            const response = await axios.post('https://api.downloadgram.org/media', data.toString());
            const $ = cheerio.load(response.data);
            const dlUrl = $('a[download]').attr('href');
            res.json({ status: true, creator: "InuuTyzDev", result: { url: dlUrl }});
        }
        else if (type === 'mediafire') {
            // Logika Mediafire
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            res.json({ status: true, creator: "InuuTyzDev", result: { dl: $('#downloadButton').attr('href') }});
        }
        else {
            res.status(400).json({ status: false, message: "Pilih type: fb, ig, atau mediafire" });
        }
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
}
