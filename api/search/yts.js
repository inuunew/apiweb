import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const query = req.query.q || req.query.query;

    if (!query) {
        return res.status(400).json({ status: false, message: "Parameter 'q' (query) diperlukan." });
    }

    try {
        // Menggunakan URL YouTube langsung agar lebih stabil
        const { data } = await axios.get("https://www.youtube.com/results", {
            params: { search_query: query },
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });

        const match = data.match(/var ytInitialData = (.*?);<\/script>/s);
        if (!match) throw new Error("Gagal parsing data Youtube.");

        const ytInitialData = JSON.parse(match[1]);
        const contents = ytInitialData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;

        if (!contents) throw new Error("Konten tidak ditemukan.");

        const section = contents.find((c) => c.itemSectionRenderer)?.itemSectionRenderer?.contents;
        if (!section) throw new Error("Section tidak ditemukan.");

        const results = section
            .filter(i => i.videoRenderer && i.videoRenderer.lengthText)
            .map(i => {
                const v = i.videoRenderer;
                return {
                    title: v.title?.runs?.[0]?.text || "No Title",
                    thumbnail: v.thumbnail?.thumbnails?.slice(-1)[0]?.url || "",
                    duration: v.lengthText?.simpleText || "0:00",
                    uploaded: v.publishedTimeText?.simpleText || "",
                    views: v.viewCountText?.simpleText || "0 views",
                    url: `https://www.youtube.com/watch?v=${v.videoId}`, // Bug kurung kurawal diperbaiki di sini
                    videoId: v.videoId
                };
            });

        res.status(200).json({ status: true, creator: "InuuTyzDev", result: results });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
