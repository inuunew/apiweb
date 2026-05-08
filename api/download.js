import axios from 'axios';
import * as cheerio from 'cheerio';
import { CookieJar } from 'tough-cookie';
import FormData from 'form-data';
import { wrapper } from 'axios-cookiejar-support';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Mengambil parameter dari URL
    const { type, url } = req.query;

    if (!url) return res.status(400).json({ status: false, message: "URL required" });

    try {
        if (type === 'tiktok') {
            // --- SEMUA LOGIKA TIKTOK DIKURUNG DI SINI ---
            class SnapTikClient {
                constructor() {
                    this.jar = new CookieJar();
                    this.client = wrapper(axios.create({
                        baseURL: "https://snaptik.app",
                        jar: this.jar,
                        withCredentials: true,
                        headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/132.0.0.0 Mobile" }
                    }));
                }

                async getScript(url) {
                    const tokenRes = await this.client.get("/en2");
                    const token = cheerio.load(tokenRes.data)('input[name="token"]').val();
                    if (!token) throw new Error("Gagal mengambil token.");

                    const form = new FormData();
                    form.append("url", url);
                    form.append("lang", "en2");
                    form.append("token", token);

                    const { data } = await this.client.post("/abc2.php", form, { headers: form.getHeaders() });
                    return data;
                }

                async process(url) {
                    const script = await this.getScript(url);
                    const script2 = await new Promise((resolve) => Function("eval", script)(resolve));

                    let html = "";
                    const mocks = {
                        $: () => ({ remove() {}, style: { display: "" }, get innerHTML() { return html; }, set innerHTML(v) { html = v; } }),
                        app: { showAlert: (e) => { throw new Error(e); } },
                        document: { getElementById: () => ({ src: "" }) },
                        fetch: () => ({ json: async () => ({}) }),
                        XMLHttpRequest: function () { return { open() {}, send() {} }; },
                        window: { location: { hostname: "snaptik.app" } },
                        gtag() {}, Math
                    };

                    Function(...Object.keys(mocks), script2)(...Object.values(mocks));

                    const $ = cheerio.load(html);
                    const links = $("div.video-links a").map((_, el) => $(el).attr("href")).get().filter(Boolean);
                    if (!links.length) throw new Error("Video tidak ditemukan.");

                    return {
                        title: $(".video-title").text().trim() || "No Title",
                        author: $(".info span").text().trim() || "Unknown",
                        thumbnail: $(".avatar").attr("src") || $("#thumbnail").attr("src") || null,
                        links: [...new Set(links)]
                    };
                }
            }

            const client = new SnapTikClient();
            const result = await client.process(url);
            return res.status(200).json({ status: true, creator: "InuuTyzDev", data: result });
            // --- AKHIR LOGIKA TIKTOK ---
        } 
        else if (type === 'fb') {
            const { data } = await axios.get('https://fdown.net');
            const $ = cheerio.load(data);
            const tokens = { v: $('input[name="token_v"]').val(), c: $('input[name="token_c"]').val(), h: $('input[name="token_h"]').val() };
            const postData = new URLSearchParams({ 'URLz': url, 'token_v': tokens.v, 'token_c': tokens.c, 'token_h': tokens.h });
            const resDl = await axios.post('https://fdown.net/download.php', postData.toString());
            const $$ = cheerio.load(resDl.data);
            return res.json({ status: true, creator: "InuuTyzDev", result: { sd: $$('#sdlink').attr('href'), hd: $$('#hdlink').attr('href') }});
        } 
        else if (type === 'ig') {
            const data = new URLSearchParams({ url, v: '3', lang: 'en' });
            const response = await axios.post('https://api.downloadgram.org/media', data.toString());
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
                throw new Error("Media tidak ditemukan.");
            }
            return res.json({ status: true, creator: "InuuTyzDev", result });
        }
        else if (type === 'mediafire') {
            const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }});
            const $ = cheerio.load(data);
            const downloadLink = $('#downloadButton').attr('href');
            if (!downloadLink) throw new Error('Gagal menemukan link download.');
            return res.json({ status: true, creator: "InuuTyzDev", result: { dl: downloadLink }});
        }
        else {
            return res.status(400).json({ status: false, message: "Type tidak valid" });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
