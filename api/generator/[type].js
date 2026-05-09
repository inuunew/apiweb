import crypto from 'crypto';
import QRCode from 'qrcode-svg';

export default async function handler(req, res) {
    // 1. Mengatur CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Mengambil parameter dinamis dari nama file [type].js
    const { type } = req.query;

    try {
        // ==========================================
        // 1. DYNAMIC QR CODE GENERATOR (SVG)
        // ==========================================
        if (type === 'qr') {
            const text = req.query.text || 'https://api.inuutyz.web.id';
            const color = req.query.color || '#00f3ff'; // Default aksen KuroNeko
            const bg = req.query.bg || '#0b0b0b';

            // Merender matriks QR secara native di Vercel
            const qr = new QRCode({ 
                content: text, 
                padding: 4, 
                width: 256, 
                height: 256, 
                color: `#${color.replace('#', '')}`, 
                background: `#${bg.replace('#', '')}`, 
                join: true 
            });

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 1 hari
            return res.status(200).send(qr.svg());
        }
        
        // ==========================================
        // 2. CAPTCHA GENERATOR (JSON + Base64 SVG)
        // ==========================================
        else if (type === 'captcha') {
            const diff = req.query.difficulty || 'medium';
            const color = req.query.color || '8A2BE2'; // Ungu khas
            
            // Logika tingkat kesulitan
            let max = diff === 'hard' ? 100 : diff === 'easy' ? 10 : 50;
            let num1 = Math.floor(Math.random() * max) + 1;
            let num2 = Math.floor(Math.random() * max) + 1;
            let answer = num1 + num2;

            // Membuat garis acak (Noise) untuk menyulitkan bot
            let noise = '';
            for(let i = 0; i < 7; i++){
                noise += `<line x1="${Math.random() * 200}" y1="${Math.random() * 80}" x2="${Math.random() * 200}" y2="${Math.random() * 80}" stroke="#${color.replace('#', '')}" stroke-width="2" opacity="0.6"/>`;
            }

            // Merakit SVG Murni
            const rawSvg = `
            <svg width="200" height="80" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="80" fill="#14141E" rx="8"/>
                ${noise}
                <text x="50%" y="50" font-family="Courier, monospace" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle" transform="rotate(${Math.random() * 14 - 7}, 100, 40)">
                    ${num1} + ${num2}
                </text>
            </svg>`;

            // Mengembalikan JSON agar sistem frontend tahu apa jawaban yang benar
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: { 
                    answer: answer.toString(),
                    svg_base64: `data:image/svg+xml;base64,${Buffer.from(rawSvg).toString('base64')}`,
                    svg_raw: rawSvg
                } 
            });
        }

        // ==========================================
        // 3. IDENTICON / AVATAR GENERATOR (SVG)
        // ==========================================
        else if (type === 'avatar') {
            const seed = req.query.seed || 'InuuTyzDev';
            const color = req.query.color || '00f3ff';
            
            // Mengubah text seed menjadi MD5 Hash (32 karakter hex)
            const hash = crypto.createHash('md5').update(seed).digest('hex');
            
            let rects = '';
            // Membuat grid 5x5. Kita hanya loop 15 kali untuk 3 kolom pertama, lalu di-mirror (refleksi) ke kanan
            for(let i = 0; i < 15; i++) {
                // Menentukan kotak diwarnai atau tidak berdasarkan nilai genap/ganjil dari hash
                const isSolid = parseInt(hash[i], 16) % 2 === 0;
                if(isSolid) {
                    const col = i % 3;
                    const row = Math.floor(i / 3);
                    rects += `<rect x="${col * 20}" y="${row * 20}" width="20" height="20" fill="#${color.replace('#', '')}"/>`;
                    // Mirroring ke sisi kanan (kolom 0 jadi 4, kolom 1 jadi 3)
                    if(col !== 2) { 
                        rects += `<rect x="${(4 - col) * 20}" y="${row * 20}" width="20" height="20" fill="#${color.replace('#', '')}"/>`;
                    }
                }
            }

            const svg = `
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#1a1a2e"/>
                ${rects}
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache selamanya untuk seed yang sama
            return res.status(200).send(svg);
        }

        // ==========================================
        // 4. LICENSE KEY GENERATOR (JSON)
        // ==========================================
        else if (type === 'license') {
            const format = req.query.format || 'XXXX-XXXX-XXXX-XXXX';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let key = '';
            
            // Membedah format user dan mengganti 'X' dengan huruf/angka acak
            for(let i = 0; i < format.length; i++) {
                if(format[i] === 'X' || format[i] === 'x') {
                    key += chars.charAt(Math.floor(Math.random() * chars.length));
                } else {
                    key += format[i];
                }
            }

            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: { 
                    format_request: format, 
                    license_key: key 
                } 
            });
        }

        // ==========================================
        // 5. CYBERPUNK STAT BAR GENERATOR (SVG)
        // ==========================================
        else if (type === 'statbar') {
            const label = req.query.label || 'API HEALTH';
            const value = Math.min(Math.max(parseInt(req.query.value) || 100, 0), 100); // Pastikan value 0 - 100
            const color = req.query.color || '8A2BE2'; 
            const bg = req.query.bg || '111111';

            const svg = `
            <svg width="350" height="40" xmlns="http://www.w3.org/2000/svg">
                <rect width="350" height="40" fill="#${bg.replace('#', '')}" rx="6" stroke="#333" stroke-width="1"/>
                
                <rect x="5" y="5" width="${(value / 100) * 340}" height="30" fill="#${color.replace('#', '')}" rx="4" opacity="0.85"/>
                
                <text x="15" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" letter-spacing="1">${label.toUpperCase()}</text>
                <text x="335" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" text-anchor="end">${value}%</text>
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'no-cache');
            return res.status(200).send(svg);
        }

        // ==========================================
        // ERROR HANDLER JIKA TYPE TIDAK ADA
        // ==========================================
        else {
            return res.status(400).json({ 
                status: false, 
                creator: "InuuTyzDev",
                message: `Generator type '${type}' tidak ditemukan di sistem KuroNeko.` 
            });
        }

    } catch (e) {
        return res.status(500).json({ 
            status: false, 
            creator: "InuuTyzDev", 
            message: e.message 
        });
    }
}
