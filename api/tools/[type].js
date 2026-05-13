import axios from 'axios'; // <-- Huruf kecil (benar)
import formidable from 'formidable';
import fs from 'fs';

// Wajib dimatikan agar Vercel bisa menerima unggahan file .html (multipart/form-data)
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // 1. Mengatur CORS Headers & Preflight
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. WAJIB BUNGKUS PROMISE AGAR VERCEL TIDAK TIMEOUT
    return new Promise((resolve) => {
        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ status: false, message: "Gagal memproses data/file." });
                return resolve();
            }

            try {
                // Gabungkan query URL, form teks, dan file
                let params = { ...req.query };
                for (const key in fields) params[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                
                const { type, url, device, domain, query, country } = params;

                if (type === 'shorturl') {
                    if (!url) { res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" }); return resolve(); }
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: `URL berhasil dipendekkan: ${url}` });
                    return resolve();
                } 
                else if (type === 'ssweb') {
                    if (!url) { res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" }); return resolve(); }
                    const targetDevice = device || 'desktop';
                    const targetUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&device=${targetDevice}&theme=light&fullPage=true`;
                    const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/png');
                    res.status(200).send(response.data);
                    return resolve();
                } 
                else if (type === 'subdomain') {
                    if (!domain) { res.status(400).json({ status: false, message: "Parameter 'domain' wajib diisi!" }); return resolve(); }
                    const response = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains?domain=${domain}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                    return resolve();
                }
                else if (type === 'kodepos') {
                    if (!query) { res.status(400).json({ status: false, message: "Parameter 'query' wajib diisi!" }); return resolve(); }
                    const response = await axios.get(`https://api.siputzx.my.id/api/tools/kodepos?form=${encodeURIComponent(query)}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                    return resolve();
                }
                else if (type === 'countryinfo') {
                    if (!country) { res.status(400).json({ status: false, message: "Parameter 'country' wajib diisi!" }); return resolve(); }
                    const response = await axios.get(`https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(country)}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                    return resolve();
                }
                else if (type === 'getcode') {
                    if (!url) { res.status(400).json({ status: false, message: "Harap sertakan parameter URL target!" }); return resolve(); }
                    const response = await fetch(url, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
                    });
                    if (!response.ok) throw new Error(`Website menolak akses. Status: ${response.status}`);
                    const html = await response.text();
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: { html: html } });
                    return resolve();
                }
                
                // ==========================================
                // FITUR: HTML ENCRYPTOR (NuuTools Logic - BISA FILE / TEKS)
                // ==========================================
                else if (type === 'encrypthtml') {
                    let htmlToEncrypt = '';

                    // Cek: Apakah user mengunggah FILE fisik dengan nama form 'html'?
                    if (files.html) {
                        const file = Array.isArray(files.html) ? files.html[0] : files.html;
                        // BACA isi teks di dalam file .html tersebut langsung tanpa simpan permanen
                        htmlToEncrypt = fs.readFileSync(file.filepath, 'utf-8');
                        fs.unlinkSync(file.filepath)
                        
                    } else {
                        // Cek: Jika tidak ada file, ambil dari input teks/URL
                        htmlToEncrypt = params.html;
                        
                    }

                    if (!htmlToEncrypt) {
                        res.status(400).json({ 
                            status: false, 
                            creator: "InuuTyzDev",
                            message: "Data 'html' tidak ditemukan! Pastikan mengisi teks kode atau mengunggah file .html." 
                        });
                        return resolve();
                    }

                    // Mulai proses enkripsi inuuTyz
                    let step1 = Buffer.from(htmlToEncrypt, 'utf-8').toString('base64');
                    let step2 = step1.split("").reverse().join("");
                    let finalEncoded = Buffer.from(step2, 'utf-8').toString('base64');

                    const encryptedResult = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Encrypt HTML</title>
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

                    res.setHeader('Content-Type', 'text/html');
                    const fileName = `nuutools_encrypted_${Date.now()}.html`;
                    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

                    res.status(200).send(encryptedResult);
                    return resolve();
                }
                
                // ==========================================
                // ERROR HANDLER DEFAULT
                // ==========================================
                else {
                    res.status(400).json({ status: false, message: `Type tools '${type}' tidak valid` });
                    return resolve();
                }
            } catch (e) {
                res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
                return resolve();
            }
        });
    });
}
