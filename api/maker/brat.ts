import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Vercel otomatis membaca query parameters
    const text = req.query.text as string;

    if (!text) {
        return res.status(400).json({ status: false, message: "Parameter 'text' diperlukan." });
    }

    try {
        const url = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        // Set header gambar dan kirim
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(response.data);
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}
