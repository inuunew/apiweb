import axios from 'axios';
import * as cheerio from 'cheerio';

async function getFdownTokens() {
    const { data } = await axios.get('https://fdown.net', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Upgrade-Insecure-Requests': '1',
        }
    });
    const $ = cheerio.load(data);
    return {
        token_v: $('input[name="token_v"]').val(),
        token_c: $('input[name="token_c"]').val(),
        token_h: $('input[name="token_h"]').val()
    };
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = req.query.url || (req.body && req.body.url);

    if (!url) return res.status(400).json({ status: false, message: "URL required" });

    try {
        const tokens = await getFdownTokens();
        const postData = new URLSearchParams({
            'URLz': url,
            'token_v': tokens.token_v,
            'token_c': tokens.token_c,
            'token_h': tokens.token_h
        });

        const { data } = await axios.post('https://fdown.net/download.php', postData.toString(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'referer': 'https://fdown.net/',
            }
        });

        const $ = cheerio.load(data);
        if ($('.alert-danger').length > 0) throw new Error("Video is private or URL is invalid");

        const title = $('.lib-row.lib-header').text().trim() || "Facebook Video";
        const description = $('.lib-row.lib-desc').text().trim() || "No Description";
        const sdLink = $('#sdlink').attr('href');
        const hdLink = $('#hdlink').attr('href');

        if (!sdLink && !hdLink) throw new Error("No download links found");

        res.status(200).json({
            status: true,
            creator: "Danzz",
            data: { title, description, sd: sdLink || "", hd: hdLink || "" }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message || "Failed to download" });
    }
}
