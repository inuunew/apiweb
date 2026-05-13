import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

// API Key Konfigurasi
const apiKeyCuki = "cuki-x";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    return new Promise((resolve) => {
        const form = formidable({ multiples: true, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ status: false, message: "Gagal memproses data/file." });
                return resolve();
            }

            try {
                let params = { ...req.query };
                for (const key in fields) params[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
                
                const { type, url, device, domain, query, country, link, message, jumlah, count } = params;

                // --- 1. VCC GENERATOR (CUKI) ---
                if (type === 'vccgen') {
                    const cardType = params.card || 'Visa'; 
                    const vccCount = count || 1;
                    const targetUrl = `https://api.cuki.biz.id/api/tools/vccgen?apikey=${apiKeyCuki}&type=${cardType}&count=${vccCount}`;
                    
                    const response = await axios.get(targetUrl);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
                    
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                    return resolve();
                }

                // --- 2. SPAM NGL (CUKI) ---
                else if (type === 'spamngl') {
                    if (!link || !message) { res.status(400).json({ status: false, message: "Parameter 'link' dan 'message' wajib diisi!" }); return resolve(); }
                    const targetUrl = `https://api.cuki.biz.id/api/tools/spamngl?apikey=${apiKeyCuki}&link=${encodeURIComponent(link)}&message=${encodeURIComponent(message)}&jumlah=${jumlah || 1}`;
                    
                    const response = await axios.get(targetUrl);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
                    
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                    return resolve();
                }

                // --- 3. SHORT URL ---
                else if (type === 'shorturl') {
                    if (!url) { res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" }); return resolve(); }
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: `URL berhasil dipendekkan: ${url}` });
                    return resolve();
                } 

                // --- 4. SSWEB ---
                else if (type === 'ssweb') {
                    if (!url) { res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" }); return resolve(); }
                    const targetDevice = device || 'desktop';
                    const targetUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&device=${targetDevice}&theme=light&fullPage=true`;
                    const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                    res.setHeader('Content-Type', 'image/png');
                    res.status(200).send(response.data);
                    return resolve();
                } 

                // --- 5. SUBDOMAIN ---
                else if (type === 'subdomain') {
                    if (!domain) { res.status(400).json({ status: false, message: "Parameter 'domain' wajib diisi!" }); return resolve(); }
                    const response = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains?domain=${domain}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                    return resolve();
                }

                // --- 6. KODEPOS ---
                else if (type === 'kodepos') {
                    const postalQuery = query || params.q;
                    if (!postalQuery) { res.status(400).json({ status: false, message: "Parameter 'query' wajib diisi!" }); return resolve(); }
                    const response = await axios.get(`https://api.siputzx.my.id/api/tools/kodepos?form=${encodeURIComponent(postalQuery)}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                    return resolve();
                }

                // --- 7. COUNTRY INFO ---
                else if (type === 'countryinfo') {
                    if (!country) { res.status(400).json({ status: false, message: "Parameter 'country' wajib diisi!" }); return resolve(); }
                    const response = await axios.get(`https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(country)}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') { delete cleanData.creator; delete cleanData.status; }
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                    return resolve();
                }

                // --- 8. GET CODE (HTML) ---
                else if (type === 'getcode') {
                    if (!url) { res.status(400).json({ status: false, message: "Harap sertakan parameter URL target!" }); return resolve(); }
                    const response = await axios.get(url);
                    res.status(200).json({ status: true, creator: "InuuTyzDev", result: { html: response.data } });
                    return resolve();
                }
                
                // --- 9. HTML ENCRYPTOR ---
                else if (type === 'encrypthtml') {
                    let htmlToEncrypt = '';
                    if (files.html) {
                        const file = Array.isArray(files.html) ? files.html[0] : files.html;
                        htmlToEncrypt = fs.readFileSync(file.filepath, 'utf-8');
                        fs.unlinkSync(file.filepath);
                    } else {
                        htmlToEncrypt = params.html;
                    }

                    if (!htmlToEncrypt) {
                        res.status(400).json({ status: false, message: "Data 'html' tidak ditemukan!" });
                        return resolve();
                    }

                    let step1 = Buffer.from(htmlToEncrypt, 'utf-8').toString('base64');
                    let step2 = step1.split("").reverse().join("");
                    let finalEncoded = Buffer.from(step2, 'utf-8').toString('base64');

                    const encryptedResult = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Encrypted</title></head><body><script>(function(){let data="${finalEncoded}";let s1=atob(data);let s2=s1.split("").reverse().join("");let s3=decodeURIComponent(escape(atob(s2)));document.write(s3);})();</script></body></html>`;

                    res.setHeader('Content-Type', 'text/html');
                    res.status(200).send(encryptedResult);
                    return resolve();
                }
                
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
