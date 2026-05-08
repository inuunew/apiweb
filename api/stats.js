import os from 'os';

export default function handler(req, res) {
    // Fungsi pengubah ukuran byte ke bentuk yang mudah dibaca
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    // Fungsi pengubah detik menjadi hari, jam, menit, detik
    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${d}d ${h}h ${m}m ${s}s`;
    };

    // Mengambil data spesifikasi server Vercel secara real-time
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercent = Math.round((usedMem / totalMem) * 100);

    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'Vercel Serverless Engine';
    const loadAvg = os.loadavg()[0] || 0;

    // Karena serverless tidak menyimpan history request secara permanen,
    // kita sediakan log statis yang mencerminkan status Edge Network
    const mockRequests = [
        "[GET] [200] /api/config",
        "[GET] [200] /api/reminder",
        "[GET] [200] /api/stats",
        "[SYSTEM] Listening to Vercel Edge Network..."
    ];

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        status: true,
        server: {
            uptime: formatUptime(os.uptime()),
            hostname: "Vercel Edge Platform",
            arch: os.arch(),
            node_version: process.version,
            cpu: {
                model: cpuModel,
                cores: cpus.length,
                load: loadAvg.toFixed(2)
            },
            memory: {
                total: formatBytes(totalMem),
                used: formatBytes(usedMem),
                free: formatBytes(freeMem),
                percent: memPercent
            }
        },
        requests: mockRequests
    });
}
