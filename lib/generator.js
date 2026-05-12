import crypto from 'crypto';
import QRCode from 'qrcode-svg';

// ==========================================
// KAMUS WARNA (INDONESIA & INGGRIS -> HEX)
// ==========================================
const colorDictionary = {
    "putih": "ffffff", "white": "ffffff",
    "hitam": "000000", "black": "000000",
    "merah": "ff0000", "red": "ff0000",
    "biru": "0000ff", "blue": "0000ff",
    "hijau": "00ff00", "green": "00ff00",
    "kuning": "ffff00", "yellow": "ffff00",
    "ungu": "8a2be2", "purple": "8a2be2",
    "abu": "808080", "gray": "808080", "grey": "808080",
    "pink": "ffc0cb", "merahmuda": "ffc0cb",
    "oren": "ffa500", "orange": "ffa500",
    "cyan": "00ffff", "magenta": "ff00ff"
};

// Fungsi pintar untuk menerjemahkan input user
function parseColor(input, defaultHex) {
    if (!input) return defaultHex;
    let cleanInput = input.toLowerCase().trim();
    
    // 1. Cek apakah user mengetik nama warna yang ada di kamus
    if (colorDictionary[cleanInput]) {
        return colorDictionary[cleanInput];
    }
    
    // 2. Jika tidak ada di kamus, asumsikan user mengetik kode Hex murni.
    // Hapus tanda '#' jika user tidak sengaja memasukkannya.
    return cleanInput.replace('#', '');
}

export async function handleGenerator(req, res) {
    // POTONG URL SECARA MANUAL UNTUK MENDAPATKAN 'type'
    const type = req.url.split('?')[0].split('/').pop();

    try {
        // ==========================================
        // 1. DYNAMIC QR CODE GENERATOR (SVG)
        // ==========================================
        if (type === 'qr') {
            const text = req.query.text || 'https://api.inuutyz.web.id';
            // Gunakan parseColor di sini
            const color = parseColor(req.query.color, '00f3ff'); 
            const bg = parseColor(req.query.bg, '0b0b0b');

            const qr = new QRCode({ 
                content: text, 
                padding: 4, 
                width: 256, 
                height: 256, 
                color: `#${color}`, 
                background: `#${bg}`, 
                join: true 
            });

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=86400'); 
            return res.status(200).send(qr.svg());
        }
        
        // ==========================================
        // 2. CAPTCHA GENERATOR (JSON + Base64 SVG / Direct Image)
        // ==========================================
        else if (type === 'captcha') {
            const diff = req.query.difficulty || 'medium';
            const color = parseColor(req.query.color, '8a2be2'); 
            
            let max = diff === 'hard' ? 100 : diff === 'easy' ? 10 : 50;
            let num1 = Math.floor(Math.random() * max) + 1;
            let num2 = Math.floor(Math.random() * max) + 1;
            let answer = num1 + num2;

            let noise = '';
            for(let i = 0; i < 7; i++){
                noise += `<line x1="${Math.random() * 200}" y1="${Math.random() * 80}" x2="${Math.random() * 200}" y2="${Math.random() * 80}" stroke="#${color}" stroke-width="2" opacity="0.6"/>`;
            }

            const rawSvg = `
            <svg width="200" height="80" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="80" fill="#14141E" rx="8"/>
                ${noise}
                <text x="50%" y="50" font-family="Courier, monospace" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle" transform="rotate(${Math.random() * 14 - 7}, 100, 40)">
                    ${num1} + ${num2}
                </text>
            </svg>`;

            if (req.query.view === 'image') {
                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'no-cache');
                return res.status(200).send(rawSvg);
            }

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
            const color = parseColor(req.query.color, '00f3ff');
            
            const hash = crypto.createHash('md5').update(seed).digest('hex');
            
            let rects = '';
            for(let i = 0; i < 15; i++) {
                const isSolid = parseInt(hash[i], 16) % 2 === 0;
                if(isSolid) {
                    const col = i % 3;
                    const row = Math.floor(i / 3);
                    rects += `<rect x="${col * 20}" y="${row * 20}" width="20" height="20" fill="#${color}"/>`;
                    if(col !== 2) { 
                        rects += `<rect x="${(4 - col) * 20}" y="${row * 20}" width="20" height="20" fill="#${color}"/>`;
                    }
                }
            }

            const svg = `
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#1a1a2e"/>
                ${rects}
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            return res.status(200).send(svg);
        }

        // ==========================================
        // 4. LICENSE KEY GENERATOR (JSON)
        // ==========================================
        else if (type === 'license') {
            const format = req.query.format || 'XXXX-XXXX-XXXX-XXXX';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let key = '';
            
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
                result: { format_request: format, license_key: key } 
            });
        }

        // ==========================================
        // 5. CYBERPUNK STAT BAR GENERATOR (SVG)
        // ==========================================
        else if (type === 'statbar') {
            const label = req.query.label || 'API HEALTH';
            const value = Math.min(Math.max(parseInt(req.query.value) || 100, 0), 100); 
            const color = parseColor(req.query.color, '8a2be2'); 
            const bg = parseColor(req.query.bg, '111111');

            const svg = `
            <svg width="350" height="40" xmlns="http://www.w3.org/2000/svg">
                <rect width="350" height="40" fill="#${bg}" rx="6" stroke="#333" stroke-width="1"/>
                <rect x="5" y="5" width="${(value / 100) * 340}" height="30" fill="#${color}" rx="4" opacity="0.85"/>
                <text x="15" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" letter-spacing="1">${label.toUpperCase()}</text>
                <text x="335" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" text-anchor="end">${value}%</text>
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'no-cache');
            return res.status(200).send(svg);
        }  

        // ==========================================
        // 6. PLACEHOLDER IMAGE GENERATOR (SVG)
        // ==========================================
        else if (type === 'placeholder') {
            const w = parseInt(req.query.w) || 300;
            const h = parseInt(req.query.h) || 300;
            const bg = parseColor(req.query.bg, '1a1a2e');
            const color = parseColor(req.query.color, '8a2be2');
            const text = req.query.text || `${w} x ${h}`;

            const fontSize = Math.max(12, Math.min(w, h) / 8);

            const svg = `
            <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
                <rect width="${w}" height="${h}" fill="#${bg}"/>
                <text x="50%" y="50%" fill="#${color}" font-family="Orbitron, Arial, sans-serif" font-size="${fontSize}" font-weight="bold" dominant-baseline="middle" text-anchor="middle">
                    ${text}
                </text>
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            return res.status(200).send(svg);
        }

        // ==========================================
        // 7. AESTHETIC WAVE BACKGROUND (SVG)
        // ==========================================
        else if (type === 'wave') {
            const color1 = parseColor(req.query.color1, '8a2be2'); 
            const color2 = parseColor(req.query.color2, '00f3ff'); 
            const bg = parseColor(req.query.bg, '050505');

            const svg = `
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#${color1}" />
                        <stop offset="100%" stop-color="#${color2}" />
                    </linearGradient>
                </defs>
                <rect width="1440" height="320" fill="#${bg}"/>
                <path fill="url(#waveGrad)" fill-opacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,80C960,64,1056,96,1152,112C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.status(200).send(svg);
        }

        // ==========================================
        // 8. SECURE TOKEN / PASSWORD GENERATOR
        // ==========================================
        else if (type === 'token') {
            const length = parseInt(req.query.length) || 16;
            const useSymbols = req.query.symbols === 'true'; 

            const safeLength = Math.min(length, 256); 

            let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            if (useSymbols) {
                chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
            }

            let token = '';
            for (let i = 0; i < safeLength; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: { length: safeLength, includes_symbols: useSymbols, token: token } 
            });
        }

        // ==========================================
        // ERROR HANDLER
        // ==========================================
        else {
            return res.status(400).json({ 
                status: false, 
                creator: "InuuTyzDev",
                message: `Generator type '${type}' tidak ditemukan di sistem.` 
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
