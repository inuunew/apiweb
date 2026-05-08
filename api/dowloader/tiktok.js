import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import * as cheerio from 'cheerio';
import FormData from 'form-data';
import { wrapper } from 'axios-cookiejar-support';

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

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = req.query.url || (req.body && req.body.url);
    if (!url) return res.status(400).json({ status: false, message: "URL required" });

    try {
        const client = new SnapTikClient();
        const result = await client.process(url);
        res.status(200).json({ status: true, creator: "Danzz", data: result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
