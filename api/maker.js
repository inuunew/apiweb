export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Ambil type dan parameter lain dari URL
    const { type, text } = req.query;

    try {
        if (type === 'brat') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" });
            
            // Logika Brat Generator kamu taruh di sini
            // (Sementara saya buatkan response sukses kosong)
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                message: "Brat sukses diproses",
                result: `Membuat stiker dengan teks: ${text}` 
            });
        }
        else {
            return res.status(400).json({ status: false, message: "Type maker tidak ditemukan" });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
