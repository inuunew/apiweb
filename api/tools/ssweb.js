import axios from 'axios';

async function generateScreenshot(url, width, height, scale) {
    // Saya tambahkan pengecekan http:// agar lebih fleksibel
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        throw new Error('Invalid url. URL must start with http:// or https://');
    }
    
    const payload = {
        url: url,
        browserWidth: width,
        browserHeight: height,
        fullPage: false,
        deviceScaleFactor: scale,
        format: 'png'
    };

    const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', payload, {
        headers: {
            'content-type': 'application/json',
            referer: 'https://imagy.app/full-page-screenshot-taker/',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
        }
    });

    if (!data.fileUrl) throw new Error('Failed to generate screenshot');
    return data.fileUrl;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const url = req.query.url || (req.body && req.body.url);
    const type = req.query.type || (req.body && req.body.type) || 'windows';

    if (!url) {
        return res.status(400).json({ status: false, message: "Parameter 'url' diperlukan." });
    }

    let width = 1920;
    let height = 1080;
    let scale = 1;

    if (type.toLowerCase() === 'mobile') {
        width = 375;
        height = 812;
        scale = 2; 
    } else if (type.toLowerCase() === 'windows' || type.toLowerCase() === 'desktop') {
        width = 1920;
        height = 1080;
        scale = 1;
    }

    try {
        const imageUrl = await generateScreenshot(url, width, height, scale);
        
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(imageResponse.data);

        // Langsung kembalikan sebagai format gambar, bukan JSON
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(buffer);

    } catch (error) {
        // Jika error, baru kembalikan format JSON (biar ketahuan errornya apa)
        res.status(500).json({ status: false, creator: "InuuTyzDev", message: error.message });
    }
}
