import axios from 'axios';
import JavaScriptObfuscator from 'javascript-obfuscator';

export default async function handler(req, res) {
    // 1. Mengatur CORS Headers & Preflight
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Tambahkan POST di sini agar bisa menerima raw HTML yang panjang
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Ambil parameter dari URL (untuk GET)
    const { type, url, device, domain, query, country } = req.query;

    try {
        if (type === 'shorturl') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `URL berhasil dipendekkan: ${url}` });
        } 
        else if (type === 'ssweb') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });
            const targetDevice = device || 'desktop';
            const targetUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&device=${targetDevice}&theme=light&fullPage=true`;
            const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
            res.setHeader('Content-Type', 'image/png');
            return res.status(200).send(response.data);
        } 
        else if (type === 'subdomain') {
            if (!domain) return res.status(400).json({ status: false, message: "Parameter 'domain' wajib diisi!" });
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains?domain=${domain}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        else if (type === 'kodepos') {
            if (!query) return res.status(400).json({ status: false, message: "Parameter 'query' wajib diisi!" });
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/kodepos?form=${encodeURIComponent(query)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        else if (type === 'countryinfo') {
            if (!country) return res.status(400).json({ status: false, message: "Parameter 'country' wajib diisi!" });
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(country)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
            
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        else if (type === 'getcode') {
            if (!url) return res.status(400).json({ status: false, message: "Harap sertakan parameter URL target!" });
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
            });
            if (!response.ok) throw new Error(`Website menolak akses. Status: ${response.status}`);
            const html = await response.text();
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { html: html } });
        }
                // ==========================================
        // FITUR: HTML ENCRYPTOR (NuuTools Logic)
        // ==========================================
        else if (type === 'encrypthtml') {
            // Ambil data HTML dari POST body (disarankan) atau GET query
            const htmlToEncrypt = (req.body && req.body.html) ? req.body.html : req.query.html;

            if (!htmlToEncrypt) {
                return res.status(400).json({ 
                    status: false, 
                    creator: "InuuTyzDev",
                    message: "Data 'html' tidak ditemukan!" 
                });
            }

            // --- ALGORITMA ENKRIPSI NUUTOOLS (Node.js Version) ---
            // Step 1: Ubah ke Base64 (Buffer akan otomatis menangani karakter UTF-8 seperti fungsi unescape/encodeURIComponent)
            let step1 = Buffer.from(htmlToEncrypt, 'utf-8').toString('base64');
            
            // Step 2: Reverse (Balikkan) susunan hurufnya
            let step2 = step1.split("").reverse().join("");
            
            // Step 3: Base64-kan lagi hasil balikannya
            let finalEncoded = Buffer.from(step2, 'utf-8').toString('base64');

            // --- TEMPLATE HTML PEMBUNGKUS (Auto-Decode) ---
            const encryptedResult = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Secured by NuuTools API</title>
</head>
<body>
<script>
(function(){
let data="${finalEncoded}";
let step1=atob(data);
let step2=step1.split("").reverse().join("");
let step3=decodeURIComponent(escape(atob(step2)));
document.write(step3);
})();
</script>
</body>
</html>`;

            // --- LOGIKA PENGIRIMAN FILE ---
            // Beritahu browser bahwa ini adalah file HTML
            res.setHeader('Content-Type', 'text/html');
            
            // Paksa browser untuk langsung mendownload filenya
            const fileName = `nuutools_encrypted_${Date.now()}.html`;
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

            // Kirim output-nya
            return res.status(200).send(encryptedResult);
        }


        else {
            return res.status(400).json({ status: false, message: `Type tools '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
