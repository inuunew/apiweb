// Lokasi file: api/index.js

// ==========================================
// 1. IMPORT SEMUA MODUL DARI FOLDER LIB
// ==========================================
import { getConfig } from '../lib/config.js';
import { handleAI } from '../lib/ai.js';
import { handleCanvas } from '../lib/canvas.js';
import { handleMaker } from '../lib/maker.js';
import { handleDownloader } from '../lib/downloader.js';
import { handleGenerator } from '../lib/generator.js';
import { handleInfo } from '../lib/info.js';
import { handleSearch } from '../lib/search.js';
import { handleStalker } from '../lib/stalker.js';
import { handleTools } from '../lib/tools.js';

// ==========================================
// 2. KONFIGURASI GLOBAL (SANGAT PENTING!)
// Matikan bodyParser bawaan Vercel agar fitur upload
// gambar/file (formidable) di canvas, maker, & tools tidak rusak.
// ==========================================
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // ==========================================
    // 3. PENGATURAN KEAMANAN (CORS GLOBAL)
    // Mengizinkan API diakses dari web/domain manapun
    // ==========================================
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Menangani Preflight Request untuk metode POST/OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Mengambil URL dari request yang masuk
    const url = req.url; 

    // ==========================================
    // 4. SISTEM ROUTING PINTAR
    // Mengarahkan URL ke file lib yang tepat
    // ==========================================
    
    // --- KHUSUS MENU DOCS HTML ---
    if (url.startsWith('/api/config')) {
        return getConfig(req, res); 
    }

    // --- KELOMPOK API ---
    if (url.startsWith('/api/ai/')) {
        return handleAI(req, res);
    }
    if (url.startsWith('/api/canvas/')) {
        return handleCanvas(req, res);
    }
    if (url.startsWith('/api/maker/')) {
        return handleMaker(req, res);
    }
    if (url.startsWith('/api/download/')) {
        return handleDownloader(req, res);
    }
    if (url.startsWith('/api/generator/')) {
        return handleGenerator(req, res);
    }
    if (url.startsWith('/api/info/')) {
        return handleInfo(req, res);
    }
    if (url.startsWith('/api/search/')) {
        return handleSearch(req, res);
    }
    if (url.startsWith('/api/stalker/')) {
        return handleStalker(req, res);
    }
    if (url.startsWith('/api/tools/')) {
        return handleTools(req, res);
    }

    // ==========================================
    // 5. JIKA URL TIDAK DITEMUKAN (FALLBACK 404)
    // ==========================================
    return res.status(404).json({
        status: false,
        creator: "InuuTyzDev",
        message: "Endpoint tidak ditemukan. Pastikan penulisan URL sudah benar sesuai dokumentasi di /docs.html"
    });
}
