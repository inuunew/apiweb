export default async function handler(req, res) {
    const text = req.query.text;

    if (!text) {
        return res.status(400).json({ status: false, message: "Parameter 'text' diperlukan." });
    }

    try {
        const url = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
        
        // Menggunakan fetch bawaan Node.js (Tanpa perlu Axios)
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (!response.ok) throw new Error(`Gagal mengambil gambar: ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send(buffer);
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
