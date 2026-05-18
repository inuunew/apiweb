import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import sharp from 'sharp';
import QRCode from 'qrcode-svg';
import xml2js from 'xml2js';
import FormData from 'form-data';           // ← tambah ini (untuk gptonline & deepaitxt2img)
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const entertainmentData = require('../../database/entertainment.json');
const animeData = require('../../database/anime.json');


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

function parseColor(input, defaultHex) {
    if (!input) return defaultHex;
    let cleanInput = input.toLowerCase().trim();
    if (colorDictionary[cleanInput]) {
        return colorDictionary[cleanInput];
    }
    return cleanInput.replace('#', '');
}

// =============================================
// SPOTIFY CLASS (by Ditzzx)
// =============================================
class Parser {
  _getImg(o) { return (o?.sources||[]).map(s=>({url:s.url,width:s.width||s.maxWidth||null,height:s.height||s.maxHeight||null})); }
  _getCol(o) { return o?.extractedColors?.colorRaw?.hex||o?.extractedColors?.colorDark?.hex||null; }
  _getVI(v) { return v?.squareCoverImage?.extractedColorSet?{text_color:v.squareCoverImage.extractedColorSet.encoreBaseSetTextColor||null,high_contrast:v.squareCoverImage.extractedColorSet.highContrast||null,higher_contrast:v.squareCoverImage.extractedColorSet.higherContrast||null,min_contrast:v.squareCoverImage.extractedColorSet.minContrast||null}:null; }
  _getLink(uri) { if(!uri)return{id:null,url:null};const p=uri.split(':');return{uri,id:p[2]||null,url:p[2]?`https://open.spotify.com/${p[1]}/${p[2]}`:null}; }

  parseSearch(res) {
    if (!res) return null;
    const parse = (arr, mapFn, isTrack = false) => (arr || []).reduce((acc, node) => {
      const d = isTrack ? node.item?.data : node.data;
      if (d) acc.push({ ...mapFn(d), ...(node.matchedFields && { matched_fields: node.matchedFields }) });
      return acc;
    }, []);
    const trackItems = res.tracksV2?.items?.length ? res.tracksV2.items : res.topResultsV2?.itemsV2?.filter(i => i.item?.__typename === "TrackResponseWrapper");
    return {
      top_results: (res.topResultsV2?.itemsV2||[]).reduce((acc,node)=>{const wrap=node.item;const d=wrap?.data;if(!d)return acc;const type=wrap.__typename?.replace('ResponseWrapper','')||'Unknown';acc.push({type,...this._getLink(d.uri),name:d.name||d.profile?.name||d.displayName||null,images:this._getImg(d.coverArt||d.visuals?.avatarImage||d.images?.items?.[0]||d.avatar),matched_fields:node.matchedFields||[]});return acc;},[]),
      tracks: parse(trackItems, t => ({...this._getLink(t.uri),name:t.name||null,duration_ms:t.duration?.totalMilliseconds||0,explicit:t.contentRating?.label==="EXPLICIT",artists:(t.artists?.items||[]).map(a=>({...this._getLink(a.uri),name:a.profile?.name})),album:{...this._getLink(t.albumOfTrack?.uri),name:t.albumOfTrack?.name||null,images:this._getImg(t.albumOfTrack?.coverArt)}}), true),
      albums: parse(res.albumsV2?.items, a => ({...this._getLink(a.uri),name:a.name||null,type:a.type||null,release_year:a.date?.year||null,artists:(a.artists?.items||[]).map(art=>({...this._getLink(art.uri),name:art.profile?.name})),images:this._getImg(a.coverArt)})),
      artists: parse(res.artists?.items, art => ({...this._getLink(art.uri),name:art.profile?.name||null,images:this._getImg(art.visuals?.avatarImage)})),
      playlists: parse(res.playlists?.items, pl => ({...this._getLink(pl.uri),name:pl.name||null,description:pl.description||null,images:this._getImg(pl.images?.items?.[0]),owner:{display_name:pl.ownerV2?.data?.name||null}}))
    };
  }
  parseTrack(data) { const t=data?.track||data;if(!t||t.__typename!=='Track')return null;const allArtists=[...(t.firstArtist?.items||[]),...(t.otherArtists?.items||[])];return{...this._getLink(t.uri),name:t.name||null,duration_ms:t.duration?.totalMilliseconds||0,playcount:parseInt(t.playcount)||0,explicit:t.contentRating?.label==="EXPLICIT",album:{...this._getLink(t.albumOfTrack?.uri),name:t.albumOfTrack?.name||null,images:this._getImg(t.albumOfTrack?.coverArt)},artists:allArtists.map(node=>({...this._getLink(node.uri),name:node.profile?.name||null}))}; }
  parseArtist(data) { const a=data?.artist||data;if(!a||a.__typename!=='Artist')return null;return{...this._getLink(a.uri||`spotify:artist:${a.id}`),name:a.profile?.name||null,verified:!!a.profile?.verified,images:this._getImg(a.visuals?.avatarImage),statistics:{followers:a.stats?.followers||0,monthly_listeners:a.stats?.monthlyListeners||0},top_tracks:(a.discography?.topTracks?.items||[]).map(node=>({...this._getLink(node.track?.uri),name:node.track?.name||null,playcount:parseInt(node.track?.playcount)||0,album:{...this._getLink(node.track?.albumOfTrack?.uri),name:node.track?.albumOfTrack?.name||null,images:this._getImg(node.track?.albumOfTrack?.coverArt)}}))}; }
  parseAlbum(data) { const al=data?.albumUnion||data?.album||data;if(!al||(al.__typename!=='Album'&&al.__typename!=='AlbumRelease'))return null;return{...this._getLink(al.uri),name:al.name||null,type:al.type||null,release_date:al.date?.isoString||al.date?.year||null,label:al.label||null,images:this._getImg(al.coverArt),artists:(al.artists?.items||[]).map(art=>({...this._getLink(art.uri),name:art.profile?.name||null})),tracks:(al.tracks?.items||al.tracksV2?.items||[]).map(node=>{const t=node.track||node;return{...this._getLink(t.uri),name:t.name||null,duration_ms:t.duration?.totalMilliseconds||0,artists:(t.artists?.items||[]).map(a=>({...this._getLink(a.uri),name:a.profile?.name}))};})}; }
  parsePlaylist(data) { const pl=data?.playlistV2||data?.playlist||data;if(!pl||(pl.__typename!=='Playlist'&&pl.__typename!=='PlaylistResponseWrapper'))return null;return{...this._getLink(pl.uri),name:pl.name||null,description:pl.description||null,images:this._getImg(pl.images?.items?.[0]||pl.image),owner:{display_name:pl.ownerV2?.data?.name||null,username:pl.ownerV2?.data?.username||null},tracks:(pl.content?.items||pl.tracks?.items||[]).map(node=>{const t=node.item?.data||node.track||node;if(!t||t.__typename!=='Track')return null;return{...this._getLink(t.uri),name:t.name||null,duration_ms:t.duration?.totalMilliseconds||0,album:{...this._getLink(t.albumOfTrack?.uri),name:t.albumOfTrack?.name||null,images:this._getImg(t.albumOfTrack?.coverArt)},artists:(t.artists?.items||[]).map(a=>({...this._getLink(a.uri),name:a.profile?.name}))};}).filter(Boolean)}; }
}

class Spotify {
  constructor() {
    this.cfg = {
      secret: '376136387538459893883312310911992847112448894410210511297108',
      version: 61,
      client_version: '1.2.88.61.ge172202b',
      query: {
        search: { opt: "searchDesktop", sha: "21b3fe49546912ba782db5c47e9ef5a7dbd20329520ba0c7d0fcfadee671d24e" },
        track:  { opt: "getTrack",      sha: "612585ae06ba435ad26369870deaae23b5c8800a256cd8a57e08eddc25a37294" },
        artist: { opt: "queryArtistOverview", sha: "5b9e64f43843fa3a9b6a98543600299b0a2cbbbccfdcdcef2402eb9c1017ca4c" },
        album:  { opt: "getAlbum",      sha: "b9bfabef66ed756e5e13f68a942deb60bd4125ec1f1be8cc42769dc0259b4b10" },
        playlist: { opt: "fetchPlaylist", sha: "32b05e92e438438408674f95d0fdad8082865dc32acd55bd97f5113b8579092b" }
      }
    };
    this.is = axios.create({ headers: { 'referer':'https://open.spotify.com/','origin':'https://open.spotify.com','content-type':'application/json','accept':'application/json','user-agent':'Mozilla/5.0 (Linux; Android 16; NX729J) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36' } });
    this.parser = new Parser();
  }

  generateTOTP(tsms) {
    const counter = Math.floor((tsms / 1000) / 30);
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter));
    const hmac = crypto.createHmac('sha1', Buffer.from(this.cfg.secret, "utf8")).update(buffer);
    const digest = hmac.digest();
    const offset = digest[digest.length - 1] & 0xf;
    const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1000000;
    return code.toString().padStart(6, '0');
  }

  async getToken() {
    try {
      if (this.is.defaults.headers.authorization) return true;
      const sts = Math.floor(Date.now() / 1000);
      const { data: token } = await this.is.get("https://open.spotify.com/api/token", { params: { reason:"init", productType:"web-player", totp:this.generateTOTP(Date.now()), totpServer:this.generateTOTP(sts*1000), totpVer:String(this.cfg.version) } });
      const { data: client } = await this.is.post('https://clienttoken.spotify.com/v1/clienttoken', { client_data: { client_version:this.cfg.client_version, client_id:token.clientId, js_sdk_data: { device_brand:"unknown", device_model:"unknown", os:"linux", os_version:"24.04", device_id:crypto.randomUUID(), device_type:"computer" } } });
      Object.assign(this.is.defaults.headers, { 'accept-language':'en','app-platform':'WebPlayer','authorization':`Bearer ${token.accessToken}`,'client-token':client.granted_token.token,'spotify-app-version':this.cfg.client_version });
      return true;
    } catch { return false; }
  }

  async query(name, vars) {
    if (!(await this.getToken())) return;
    const sel = this.cfg.query[name];
    const { data: res } = await this.is.post('https://api-partner.spotify.com/pathfinder/v2/query', { variables:vars, operationName:sel.opt, extensions:{ persistedQuery:{ version:1, sha256Hash:sel.sha } } });
    return res;
  }

  async search(query)   { const res = await this.query("search",   { searchTerm:query, offset:0, limit:10, numberOfTopResults:5, includeAudiobooks:true, includeArtistHasConcertsField:false, includePreReleases:true, includeAuthors:false, includeEpisodeContentRatingsV2:false }); return this.parser.parseSearch(res.data.searchV2); }
  async track(id)       { const res = await this.query("track",    { uri:`spotify:track:${id}` }); return this.parser.parseTrack(res.data.trackUnion); }
  async artist(id)      { const res = await this.query("artist",   { uri:`spotify:artist:${id}`, locale:"", preReleaseV2:false }); return this.parser.parseArtist(res.data.artistUnion); }
  async album(id)       { const res = await this.query("album",    { uri:`spotify:album:${id}`, locale:"", offset:0, limit:50 }); return this.parser.parseAlbum(res.data.albumUnion); }
  async playlist(id)    { const res = await this.query("playlist", { uri:`spotify:playlist:${id}`, offset:0, limit:25, enableWatchFeedEntrypoint:false, includeEpisodeContentRatingsV2:false }); return this.parser.parsePlaylist(res.data.playlistV2); }
}

const spotifyClient = new Spotify();

// Spotify Downloader
async function SpotifyDl(url) {
  try {
    const { data: pp } = await axios.post('https://gamepvz.com/api/download/get-url', { url }, { headers: { 'content-type':'application/json','user-agent':'Mozilla/5.0' } });
    return { status:true, title:pp.title, author:pp.authorName, cover:pp.coverUrl, dl:Buffer.from(pp.originalVideoUrl.split('url=')[1], 'base64').toString('utf-8') };
  } catch { return { status: false }; }
}

// Spotify Card Image
const escapeXml = (s) => (s||"").replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));
function wrapText(text, maxCharsPerLine = 22) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + word).length > maxCharsPerLine) { if (currentLine) lines.push(currentLine.trim()); currentLine = word + ' '; }
    else { currentLine += word + ' '; }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}
async function loadImageFromURL(url) {
  if (!url) return null;
  if (Buffer.isBuffer(url)) return url;
  try { const r = await axios.get(url, { responseType:'arraybuffer', timeout:4000 }); return Buffer.from(r.data,'binary'); } catch { return null; }
}
async function drawCardSpotify({ bg, cover, title, artist }) {
  const { default: sharp } = await import('sharp');
  const width=320,height=420,cardX=20,cardY=20,cardWidth=280,cardHeight=380,radius=20;
  const coverBuffer = await loadImageFromURL(cover);
  let dominantColor = '#222222';
  if (coverBuffer) { try { const stats = await sharp(coverBuffer).stats(); const {r,g,b}=stats.dominant; dominantColor=`rgb(${r},${g},${b})`; } catch {} }
  let baseImageBuffer;
  if (bg) { const bgBuffer = await loadImageFromURL(bg); if (bgBuffer) baseImageBuffer = await sharp(bgBuffer).resize(width,height,{fit:'cover'}).toBuffer(); }
  if (!baseImageBuffer) baseImageBuffer = await sharp({create:{width,height,channels:4,background:dominantColor}}).png().toBuffer();
  const composites = [];
  composites.push({ input: Buffer.from(`<svg width="${width}" height="${height}"><rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="${radius}" ry="${radius}" fill="rgba(0,0,0,0.7)"/></svg>`), top:0, left:0 });
  if (coverBuffer) { const rc = await sharp(coverBuffer).resize(240,240,{fit:'cover'}).toBuffer(); composites.push({input:rc,left:cardX+20,top:cardY+20}); }
  let currentY = cardY + 282;
  let textSvg = `<svg width="${width}" height="${height}"><style>.t{font-family:sans-serif;font-weight:bold;font-size:22px;fill:white;}.a{font-family:sans-serif;font-size:16px;fill:rgba(255,255,255,0.8);}</style>`;
  for (const line of wrapText((title||'').substring(0,26),20)) { textSvg += `<text x="${cardX+20}" y="${currentY}" class="t">${escapeXml(line)}</text>`; currentY += 26; }
  currentY += 2;
  for (const line of wrapText(artist||'',28)) { textSvg += `<text x="${cardX+20}" y="${currentY}" class="a">${escapeXml(line)}</text>`; currentY += 20; }
  textSvg += `<text x="${cardX+40}" y="${cardY+370}" font-family="sans-serif" font-weight="bold" font-size="14px" fill="white">Spotify</text></svg>`;
  composites.push({ input: Buffer.from(textSvg), top:0, left:0 });
  const logoBuffer = await loadImageFromURL("https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White-300x300.png");
  if (logoBuffer) { const lr = await sharp(logoBuffer).resize(20,20).toBuffer(); composites.push({input:lr,top:cardY+354,left:cardX+14}); }
  return await sharp(baseImageBuffer).composite(composites).png().toBuffer();
}


export default async function handler(req, res) {
    // FIX #1: Tambah variabel yang hilang: searchText, page, language
    const {
        kategori, type, q, text, color, bg, color1, color2,
        difficulty, view, seed, format, label, value, w, h,
        length, symbols, cookie, promptSystem, prompt, system,
        temperature, provinsi, kota, nik, nama, ttl, jenis_kelamin,
        golongan_darah, alamat, kecamatan, agama, status, pekerjaan,
        kewarganegaraan, masa_berlaku, terbuat, pas_photo, image,
        text1, text2, text3, name, comment, ppurl, number, title,
        time, avatarUrl, device, domain, query, country, url, user,
        username, hero, channel, surah, ayat,
        searchText,  // FIX: tambah ini
        page,        // FIX: tambah ini
        language     // FIX: tambah ini
    } = req.query;

    const apiKeyCuki = "cuki-x";

    // FIX #2: Semua blok else if kategori masuk ke dalam try utama
    try {
        // ==========================================
        // 1. KATEGORI: AI
        // ==========================================
        if (kategori === 'ai') {

            const standardAI = ['deepseekr1', 'qwq32b', 'phi2', 'glm47flash', 'gptoss120b'];

            if (standardAI.includes(type)) {
                if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

                let targetUrl = `https://api.siputzx.my.id/api/ai/${type}?prompt=${encodeURIComponent(prompt)}`;
                if (system) targetUrl += `&system=${encodeURIComponent(system)}`;
                if (temperature) targetUrl += `&temperature=${temperature}`;

                const response = await axios.get(targetUrl);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'gita') {
                if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (pertanyaan) wajib diisi!" });

                const response = await axios.get(`https://api.siputzx.my.id/api/ai/gita?q=${encodeURIComponent(q)}`);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'gemini') {
                if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" });

                let targetUrl = `https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`;
                if (cookie) targetUrl += `&cookie=${encodeURIComponent(cookie)}`;
                if (promptSystem) targetUrl += `&promptSystem=${encodeURIComponent(promptSystem)}`;

                const response = await axios.get(targetUrl);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }
            else if (type === 'deepseekv4') {
    // Base: notegpt.io — deepseek-v4-flash thinking mode (by Ditzzx)
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const convId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const rnd = (n) => Array.from({length: n}, () => Math.floor(Math.random() * 10)).join('');
    const sboxGuid = Buffer.from(`${now}|762|${rnd(9)}`).toString('base64');
    const anonId = crypto.randomUUID();
    const cookieHeader = [
        `_ga_PFX3BRW5RQ=GS2.1.s${now}$o1$g0$t${now}$j60$l0$h${rnd(9)}`,
        `_ga=GA1.2.${rnd(9)}.${now}`,
        `_gid=GA1.2.${rnd(9)}.${now}`,
        `_gat_gtag_UA_252982427_14=1`,
        `sbox-guid=${encodeURIComponent(sboxGuid)}`,
        `anonymous_user_id=${anonId}`
    ].join('; ');

    const payload = {
        message: prompt,
        language: "auto",
        model: "deepseek-v4-flash",
        tone: "default",
        length: "moderate",
        conversation_id: convId,
        image_urls: [],
        history_messages: [],
        chat_mode: "deep_think"
    };

    const dsRes = await axios.post("https://notegpt.io/api/v2/chat/stream", JSON.stringify(payload), {
        timeout: 60000,
        responseType: "stream",
        validateStatus: () => true,
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/json",
            "Origin": "https://notegpt.io",
            "Referer": "https://notegpt.io/chat-deepseek",
            "Accept": "*/*",
            "Cookie": cookieHeader
        }
    });

    let rawBody = "";
    dsRes.data.setEncoding("utf8");
    dsRes.data.on("data", (chunk) => { rawBody += chunk; });
    await new Promise((resolve) => dsRes.data.on("end", resolve));

    let answer = "", reasoning = "";
    for (const line of rawBody.split(/\r?\n/)) {
        const clean = line.trim();
        if (!clean.startsWith("data:")) continue;
        const raw = clean.replace(/^data:\s*/, "").trim();
        if (!raw || raw === "[DONE]") continue;
        try {
            const json = JSON.parse(raw);
            if (json.reasoning) reasoning += json.reasoning;
            if (json.text) answer += json.text;
        } catch {}
    }

    if (!answer && !reasoning) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat respons DeepSeek." });
    return res.status(200).json({
        status: true, creator: "InuuTyzDev",
        result: { model: "deepseek-v4-flash", mode: "deep_think", reasoning, answer }
    });
}
else if (type === 'claudehaiku') {
    // Base: overchat.ai — claude-haiku-4-5 (by Ditzzx)
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const chatId = crypto.randomUUID();
    const deviceId = crypto.randomUUID();

    const body = {
        chatId,
        model: "claude-haiku-4-5-20251001",
        messages: [
            { id: crypto.randomUUID(), role: "user", content: prompt },
            { id: crypto.randomUUID(), role: "system", content: system || "Ikuti bahasa user dan jawab dengan gaya natural, singkat, dan jelas." }
        ],
        personaId: "claude-haiku-4-5-landing",
        frequency_penalty: 0,
        max_tokens: 4000,
        presence_penalty: 0,
        stream: true,
        temperature: 0.5,
        top_p: 0.95
    };

    const chRes = await axios.post("https://api.overchat.ai/v1/chat/completions", JSON.stringify(body), {
        timeout: 60000,
        responseType: "stream",
        validateStatus: () => true,
        headers: {
            "x-device-uuid": deviceId,
            "x-device-language": "id-ID",
            "x-device-platform": "web",
            "x-device-version": "1.0.44",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/json",
            "Origin": "https://overchat.ai",
            "Referer": "https://overchat.ai/",
            "Accept": "*/*"
        }
    });

    let rawBody = "";
    chRes.data.setEncoding("utf8");
    chRes.data.on("data", (chunk) => { rawBody += chunk; });
    await new Promise((resolve) => chRes.data.on("end", resolve));

    let answer = "";
    for (const line of rawBody.split("\n")) {
        const clean = line.trim();
        if (!clean.startsWith("data:")) continue;
        const data = clean.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (typeof content === "string") answer += content;
        } catch {}
    }

    if (!answer) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat respons Claude Haiku." });
    return res.status(200).json({
        status: true, creator: "InuuTyzDev",
        result: { model: "claude-haiku-4-5-20251001", answer }
    });
}
else if (type === 'qwen3') {
    // Base: overchat.ai — qwen3-next-80b (by Ditzzx)
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const chatId = crypto.randomUUID();
    const deviceId = crypto.randomUUID();

    const body = {
        chatId,
        model: "alibaba/qwen3-next-80b-a3b-instruct",
        messages: [
            { id: crypto.randomUUID(), role: "user", content: prompt },
            { id: crypto.randomUUID(), role: "system", content: system || "Ikuti bahasa user dan jawab dengan gaya natural, singkat, dan jelas." }
        ],
        personaId: "qwen-3-landing",
        frequency_penalty: 0,
        max_tokens: 4000,
        presence_penalty: 0,
        stream: true,
        temperature: 0.5,
        top_p: 0.95
    };

    const qwRes = await axios.post("https://api.overchat.ai/v1/chat/completions", JSON.stringify(body), {
        timeout: 60000,
        responseType: "stream",
        validateStatus: () => true,
        headers: {
            "x-device-uuid": deviceId,
            "x-device-language": "id-ID",
            "x-device-platform": "web",
            "x-device-version": "1.0.44",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/json",
            "Origin": "https://overchat.ai",
            "Referer": "https://overchat.ai/",
            "Accept": "*/*"
        }
    });

    let rawBody = "";
    qwRes.data.setEncoding("utf8");
    qwRes.data.on("data", (chunk) => { rawBody += chunk; });
    await new Promise((resolve) => qwRes.data.on("end", resolve));

    let answer = "";
    for (const line of rawBody.split("\n")) {
        const clean = line.trim();
        if (!clean.startsWith("data:")) continue;
        const data = clean.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (typeof content === "string") answer += content;
        } catch {}
    }

    if (!answer) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat respons Qwen-3." });
    return res.status(200).json({
        status: true, creator: "InuuTyzDev",
        result: { model: "alibaba/qwen3-next-80b-a3b-instruct", answer }
    });
}
else if (type === 'olabiba') {
    // Base: olabiba.com — SSE stream (by Ditzzx)
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const OLA_BASE = "https://www.olabiba.com";
    const OLA_UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

    // Buat cookie consent sederhana (stateless — cocok untuk Vercel serverless)
    const now3 = Math.floor(Date.now() / 1000);
    const consentUUID = crypto.randomUUID();
    const fccdcf = encodeURIComponent(JSON.stringify([null, null, null, null, null, null, [[[32, JSON.stringify([consentUUID, [now3, 895000000]])]]]]));
    const olaCookie = `olabiba_consent=true%3A${now3 + 604800}; FCCDCF=${fccdcf}`;

    const olaHeaders = {
        "User-Agent": OLA_UA,
        "Accept-Language": "id-ID,id;q=0.9",
        "Origin": OLA_BASE,
        "Referer": `${OLA_BASE}/`,
        "Cookie": olaCookie
    };

    // Step 1: warmup
    await axios.get(OLA_BASE, { headers: olaHeaders, validateStatus: () => true }).catch(() => {});

    // Step 2: kirim pesan
    const olaForm = new URLSearchParams();
    olaForm.append("text", prompt);
    olaForm.append("mood", "friendly");
    olaForm.append("lang", "id");
    olaForm.append("adblock", "No");
    olaForm.append("theme", "light");

    await axios.post(`${OLA_BASE}/php/message.php`, olaForm.toString(), {
        timeout: 30000,
        headers: { ...olaHeaders, "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: () => true
    });

    // Step 3: baca SSE stream
    const streamRes = await axios.get(`${OLA_BASE}/php/stream.php`, {
        timeout: 30000,
        responseType: "stream",
        headers: { ...olaHeaders, "Accept": "text/event-stream", "Cache-Control": "no-cache" },
        validateStatus: () => true
    });

    let rawOla = "";
    streamRes.data.setEncoding("utf8");
    streamRes.data.on("data", (chunk) => { rawOla += chunk; });
    await new Promise((resolve) => streamRes.data.on("end", resolve));

    let olaAnswer = "";
    for (const line of rawOla.split(/\r?\n/)) {
        const clean = line.trim();
        if (!clean.startsWith("data:")) continue;
        const data = clean.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        olaAnswer += data
            .replaceAll("&nbsp;", " ").replaceAll("&amp;", "&")
            .replaceAll("&lt;", "<").replaceAll("&gt;", ">")
            .replaceAll("&quot;", '"');
    }

    // Bersihkan tag dan token internal olabiba
    olaAnswer = olaAnswer
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\[ELABORATE\]/gi, "")
        .replace(/\[FOLLOWUP(?::[^\]]*)?\][\s\S]*?(?:\[\/FOLLOWUP\])?/gi, "")
        .replace(/\s+/g, " ").trim();

    const queryIdx = olaAnswer.indexOf("<!--QUERY:");
    if (queryIdx !== -1) olaAnswer = olaAnswer.slice(0, queryIdx).trim();

    if (!olaAnswer) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat respons Olabiba." });
    return res.status(200).json({
        status: true, creator: "InuuTyzDev",
        result: { model: "olabiba-ai", answer: olaAnswer }
    });
}
else if (type === 'gpt5nano') {
    // Base: overchat.ai — openai/gpt-4o (by Ditzzx)
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const chatId = crypto.randomUUID();
    const deviceId = crypto.randomUUID();
    const userMsgId = crypto.randomUUID();
    const sysMsgId = crypto.randomUUID();

    const messages = [
        { id: userMsgId, role: "user", content: prompt },
        { id: sysMsgId, role: "system", content: system || "Ikuti bahasa user dan jawab dengan gaya natural, singkat, dan jelas." }
    ];

    const body = {
        chatId,
        model: "openai/gpt-4o",
        messages,
        personaId: "gpt-4o-landing",
        frequency_penalty: 0,
        max_tokens: 4000,
        presence_penalty: 0,
        stream: true,
        temperature: 0.5,
        top_p: 0.95
    };

    const ocRes = await axios.post("https://api.overchat.ai/v1/chat/completions", JSON.stringify(body), {
        timeout: 60000,
        responseType: "stream",
        validateStatus: () => true,
        headers: {
            "x-device-uuid": deviceId,
            "x-device-language": "id-ID",
            "x-device-platform": "web",
            "x-device-version": "1.0.44",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/json",
            "Origin": "https://overchat.ai",
            "Referer": "https://overchat.ai/",
            "Accept": "*/*"
        }
    });

    let rawBody = "";
    ocRes.data.setEncoding("utf8");
    ocRes.data.on("data", (chunk) => { rawBody += chunk; });
    await new Promise((resolve) => ocRes.data.on("end", resolve));

    let answer = "";
    for (const line of rawBody.split("\n")) {
        const clean = line.trim();
        if (!clean.startsWith("data:")) continue;
        const data = clean.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (typeof content === "string") answer += content;
        } catch {}
    }

    if (!answer) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat respons GPT." });
    return res.status(200).json({
        status: true, creator: "InuuTyzDev",
        result: { model: "openai/gpt-4o", answer }
    });
}
else if (type === 'unlimitedai') {
    // Base: unlimitedai.chat (by Ditzzx)
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const chatId = crypto.randomUUID();
    const deviceId = crypto.randomUUID();
    const userMsgId = crypto.randomUUID();
    const asstMsgId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const finalPrompt = `Kamu wajib menjawab dalam bahasa Indonesia.\n\nPertanyaan:\n${prompt}`;

    const userMsg = { id: userMsgId, role: "user", content: finalPrompt, parts: [{ type: "text", text: finalPrompt }], createdAt };
    const asstMsg = { id: asstMsgId, role: "assistant", content: "", parts: [{ type: "text", text: "" }], createdAt };

    const body = {
        chatId, messages: [userMsg, asstMsg],
        selectedChatModel: "chat-model-reasoning",
        selectedCharacter: null, selectedStory: null,
        deviceId, locale: "id"
    };

    const uaiRes = await axios.post("https://app.unlimitedai.chat/api/chat", JSON.stringify(body), {
        timeout: 60000, responseType: "stream", validateStatus: () => true,
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/json",
            "x-next-intl-locale": "id",
            "Origin": "https://app.unlimitedai.chat",
            "Referer": "https://app.unlimitedai.chat/id",
            "Cookie": `NEXT_LOCALE=id; u_device_id=${deviceId}; home_chat_id=${chatId}`
        }
    });

    let rawBody = "";
    uaiRes.data.setEncoding("utf8");
    uaiRes.data.on("data", (chunk) => { rawBody += chunk; });
    await new Promise((resolve) => uaiRes.data.on("end", resolve));

    let answer = "";
    for (const line of rawBody.split("\n")) {
        const clean = line.trim();
        if (!clean) continue;
        try {
            const json = JSON.parse(clean);
            if (json.type === "delta" && typeof json.delta === "string") answer += json.delta;
        } catch {}
    }

    if (!answer) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat respons Unlimited AI." });
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { model: "unlimited-ai", answer } });
}
else if (type === 'feelbetter') {
    // Base: feelbetterbot.com — support custom system prompt (by Ditzzx)
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const fbSystem = system || "Ikuti bahasa user dan jawab dengan gaya natural, singkat, dan jelas.";
    const animals = ["owl", "fox", "cat", "wolf", "bear"];
    const words = ["safe", "calm", "soft", "kind", "warm"];
    const memoryId = `${words[Math.floor(Math.random() * words.length)]}-${animals[Math.floor(Math.random() * animals.length)]}-${Math.floor(1000 + Math.random() * 9000)}`;

    const fbBody = {
        messages: [
            { role: "system", content: fbSystem },
            { role: "assistant", content: "Hi, I'm here to help you. How are you doing right now?" },
            { role: "user", content: prompt }
        ]
    };

    const fbRes = await axios.post("https://feelbetterbot.com/", JSON.stringify(fbBody), {
        timeout: 30000, responseType: "stream", validateStatus: () => true,
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/json",
            "Origin": "https://feelbetterbot.com",
            "Referer": "https://feelbetterbot.com/",
            "Cookie": `feelbet-memory=${memoryId}`
        }
    });

    let rawFb = "";
    fbRes.data.setEncoding("utf8");
    fbRes.data.on("data", (chunk) => { rawFb += chunk; });
    await new Promise((resolve) => fbRes.data.on("end", resolve));

    let fbAnswer = "";
    for (const line of rawFb.split("\n")) {
        const clean = line.trim();
        if (!clean) continue;
        let data = clean.startsWith("data:") ? clean.slice(5).trim() : clean;
        if (!data || data === "[DONE]") continue;
        try {
            const json = JSON.parse(data);
            const content = json.content || json.text || json.delta || json.answer || json.choices?.[0]?.delta?.content || "";
            if (content) fbAnswer += content;
        } catch { if (data) fbAnswer += data; }
    }

    if (!fbAnswer) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat respons Feelbetter AI." });
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { model: "feelbetter-ai", answer: fbAnswer } });
}
else if (type === 'gptonline') {
    // Base: gptonline.ai — support session (by Ditzzx)
    // Requires: npm install tough-cookie axios-cookiejar-support
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const { CookieJar } = await import('tough-cookie');
    const { wrapper } = await import('axios-cookiejar-support');

    const GPT_BASE = "https://gptonline.ai";
    const GPT_PAGE = `${GPT_BASE}/id/chat-online/`;
    const GPT_AJAX = `${GPT_BASE}/id/wp-admin/admin-ajax.php`;
    const GPT_UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";
    const gptUserId = crypto.randomUUID();

    const jar = new CookieJar();
    const gptClient = wrapper(axios.create({ jar, withCredentials: true, timeout: 60000, validateStatus: () => true, headers: { "user-agent": GPT_UA } }));

    // Step 1: warmup + ambil nonce
    const pageRes = await gptClient.get(GPT_PAGE);
    const pageHtml = String(pageRes.data || "");
    const nonceMatches = [...pageHtml.matchAll(/["']nonce["']\s*[:=]\s*["']([a-zA-Z0-9_-]{8,})["']/gi)];
    const nonce = nonceMatches[0]?.[1] || "";
    if (!nonce) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat nonce dari GPTOnline." });

    // Step 2: send message
    const { default: FormData } = await import('form-data');
    const sendForm = new FormData();
    sendForm.append("msg", prompt);
    sendForm.append("user_id", gptUserId);
    sendForm.append("action", "gpt_embed_send_message");

    const sendRes = await gptClient.post(GPT_AJAX, sendForm, { headers: { ...sendForm.getHeaders(), origin: GPT_BASE, referer: GPT_PAGE } });
    const chatHistoryId = sendRes.data?.id;
    if (!chatHistoryId) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mengirim pesan ke GPTOnline." });

    // Step 3: get message
    const getForm = new FormData();
    getForm.append("chat_history_id", String(chatHistoryId));
    getForm.append("user_id", gptUserId);
    getForm.append("action", "gpt_embed_get_message");
    getForm.append("nonce", nonce);

    const getRes = await gptClient.post(GPT_AJAX, getForm, { headers: { ...getForm.getHeaders(), origin: GPT_BASE, referer: GPT_PAGE } });
    let rawMsg = getRes.data?.message || "";

    // Bersihkan HTML tags
    rawMsg = rawMsg.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

    if (!rawMsg) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal membaca respons GPTOnline." });
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { model: "gptonline-ai", answer: rawMsg } });
}



            else if (type === 'gemini31') {
    // Base: notegpt.io — model gemini-3.1-flash-lite-preview (by Ditzzx)
    if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

    const convId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const rnd = (n) => Array.from({length: n}, () => Math.floor(Math.random() * 10)).join('');
    const sboxGuid = Buffer.from(`${now}|13|${rnd(9)}`).toString('base64');
    const anonId = crypto.randomUUID();
    const cookieHeader = [
        `sbox-guid=${encodeURIComponent(sboxGuid)}`,
        `anonymous_user_id=${anonId}`,
        `_gid=GA1.2.${rnd(9)}.${now}`,
        `_ga=GA1.2.${rnd(9)}.${now}`
    ].join('; ');

    const payload = {
        message: prompt,
        language: "auto",
        model: "gemini-3.1-flash-lite-preview",
        tone: "default",
        length: "moderate",
        conversation_id: convId,
        image_urls: [],
        history_messages: [],
        chat_mode: "standard"
    };

    const notegptRes = await axios.post("https://notegpt.io/api/v2/chat/stream", JSON.stringify(payload), {
        timeout: 60000,
        responseType: "stream",
        validateStatus: () => true,
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/json",
            "Origin": "https://notegpt.io",
            "Referer": "https://notegpt.io/ai-chat",
            "Accept": "*/*",
            "Cookie": cookieHeader
        }
    });

    let rawBody = "";
    notegptRes.data.setEncoding("utf8");
    notegptRes.data.on("data", (chunk) => { rawBody += chunk; });

    await new Promise((resolve) => notegptRes.data.on("end", resolve));

    let answer = "";
    for (const line of rawBody.split(/\r?\n/)) {
        const clean = line.trim();
        if (!clean.startsWith("data:")) continue;
        const raw = clean.replace(/^data:\s*/, "").trim();
        if (!raw || raw === "[DONE]") continue;
        try { const json = JSON.parse(raw); if (json.text) answer += json.text; } catch {}
    }

    if (!answer) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mendapat respons dari Gemini 3.1." });
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { model: "gemini-3.1-flash-lite-preview", answer } });
}

            else {
                return res.status(404).json({ error: `Endpoint AI '${type}' tidak ada` });
            }
        }

        // ==========================================
        // 2. KATEGORI: MAKER
        // ==========================================
        else if (kategori === 'maker') {
    if (type === 'ektp') {
        const required = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan'];
        for (const field of required) {
            if (!req.query[field]) return res.status(400).json({ status: false, message: `Parameter '${field}' wajib diisi!` });
        }

        // Fix: tangkap semua kemungkinan nama param foto
        const pasPhoto = req.query.pas_photo || req.query.Pas_Photo || req.query.image || "";
        if (!pasPhoto) return res.status(400).json({ status: false, message: "Parameter 'pas_photo' (Link Foto) wajib diisi!" });

        const rt_rw = req.query['rt/rw'] || "000/000";
        const kel_desa = req.query['kel/desa'] || "Desa";

        const targetUrl = `https://api.siputzx.my.id/api/canvas/ektp?provinsi=${encodeURIComponent(provinsi)}&kota=${encodeURIComponent(kota)}&nik=${encodeURIComponent(nik)}&nama=${encodeURIComponent(nama)}&ttl=${encodeURIComponent(ttl)}&jenis_kelamin=${encodeURIComponent(jenis_kelamin)}&golongan_darah=${encodeURIComponent(golongan_darah || '-')}&alamat=${encodeURIComponent(alamat)}&rt%2Frw=${encodeURIComponent(rt_rw)}&kel%2Fdesa=${encodeURIComponent(kel_desa)}&kecamatan=${encodeURIComponent(kecamatan)}&agama=${encodeURIComponent(agama)}&status=${encodeURIComponent(status)}&pekerjaan=${encodeURIComponent(pekerjaan)}&kewarganegaraan=${encodeURIComponent(kewarganegaraan || 'WNI')}&masa_berlaku=${encodeURIComponent(masa_berlaku || 'Seumur Hidup')}&terbuat=${encodeURIComponent(terbuat || '01-01-2024')}&pas_photo=${encodeURIComponent(pasPhoto)}`;

        const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', 'image/jpeg');
        return res.status(200).send(response.data);
    }

            else if (type === 'fbcommand') {
                if (!name || !comment || !ppurl) {
                    return res.status(400).json({ status: false, message: "Parameter 'name', 'comment', dan 'ppurl' (Link Foto) wajib diisi!" });
                }
                const targetUrl = `https://api.cuki.biz.id/api/canvas/fbcommand?apikey=${apiKeyCuki}&name=${encodeURIComponent(name)}&comment=${encodeURIComponent(comment)}&ppurl=${encodeURIComponent(ppurl)}`;
                const response = await axios.get(targetUrl, {
                    headers: { 'x-api-key': apiKeyCuki },
                    responseType: 'arraybuffer'
                });
                res.setHeader('Content-Type', 'image/png');
                return res.status(200).send(response.data);
            }

            else if (type === 'fakegroup') {
                if (!number || !title || !time || !avatarUrl) {
                    return res.status(400).json({ status: false, message: "Parameter 'number', 'title', 'time', dan 'avatarUrl' wajib diisi!" });
                }
                const targetUrl = `https://api.cuki.biz.id/api/maker/fakegroup?apikey=${apiKeyCuki}&number=${number}&title=${encodeURIComponent(title)}&time=${time}&avatarUrl=${encodeURIComponent(avatarUrl)}`;
                const response = await axios.get(targetUrl, {
                    headers: { 'x-api-key': apiKeyCuki },
                    responseType: 'arraybuffer'
                });
                res.setHeader('Content-Type', 'image/jpeg');
                return res.status(200).send(response.data);
            }

            else if (type === 'roasting') {
                if (!text1 || !text2 || !text3) {
                    return res.status(400).json({ status: false, message: "Parameter 'teks1', 'teks2', dan 'teks3' wajib diisi!" });
                }
                const targetUrl = `https://api.cuki.biz.id/api/maker/roasting?apikey=${apiKeyCuki}&teks1=${encodeURIComponent(text1)}&teks2=${encodeURIComponent(text2)}&teks3=${encodeURIComponent(text3)}`;
                const response = await axios.get(targetUrl, {
                    headers: { 'x-api-key': apiKeyCuki },
                    responseType: 'arraybuffer'
                });
                res.setHeader('Content-Type', 'image/jpeg');
                return res.status(200).send(response.data);
            }

            else {
                return res.status(404).json({ error: `Endpoint '${type}' tidak ada` });
            }
        }

        // ==========================================
        // 3. KATEGORI: STALKER
        // ==========================================
        else if (kategori === 'stalker') {
    const target = q || user || username;
    if (!target) return res.status(400).json({ status: false, message: "Parameter username/target wajib diisi!" });

    const scrapeHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.9'
    };

    try {
        // ── GITHUB ──────────────────────────────────────────
        if (type === 'github') {
            const { data } = await axios.get(`https://api.github.com/users/${encodeURIComponent(target)}`, { headers: scrapeHeaders });
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                username: data.login, name: data.name, bio: data.bio,
                avatar: data.avatar_url, url: data.html_url,
                followers: data.followers, following: data.following,
                public_repos: data.public_repos, public_gists: data.public_gists,
                company: data.company, location: data.location,
                blog: data.blog, twitter: data.twitter_username,
                created_at: data.created_at
            }});
        }

        // ── NPM ──────────────────────────────────────────────
        else if (type === 'npm') {
            const { data } = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(target)}`, { headers: scrapeHeaders });
            const latest = data['dist-tags']?.latest;
            const ver = data.versions?.[latest] || {};
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                name: data.name, description: data.description,
                version: latest, license: ver.license || data.license,
                author: ver.author?.name || data.author?.name,
                homepage: data.homepage, repository: data.repository?.url,
                keywords: data.keywords, created: data.time?.created,
                modified: data.time?.modified,
                weekly_downloads: null
            }});
        }

        // ── REDDIT ───────────────────────────────────────────
        else if (type === 'reddit') {
            const { data } = await axios.get(`https://www.reddit.com/user/${encodeURIComponent(target)}/about.json`, { headers: scrapeHeaders });
            const d = data?.data;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                username: d.name, id: d.id,
                karma_post: d.link_karma, karma_comment: d.comment_karma,
                total_karma: d.total_karma,
                avatar: d.icon_img?.split('?')[0] || null,
                is_gold: d.is_gold, is_mod: d.is_mod,
                verified: d.verified,
                created_at: new Date(d.created * 1000).toISOString(),
                url: `https://reddit.com/u/${d.name}`
            }});
        }

        // ── ROBLOX ───────────────────────────────────────────
        else if (type === 'roblox') {
            const search = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(target)}&limit=1`, { headers: scrapeHeaders });
            const userId = search.data?.data?.[0]?.id;
            if (!userId) return res.status(404).json({ status: false, message: "User Roblox tidak ditemukan." });
            const [profile, friends, followers] = await Promise.allSettled([
                axios.get(`https://users.roblox.com/v1/users/${userId}`, { headers: scrapeHeaders }),
                axios.get(`https://friends.roblox.com/v1/users/${userId}/friends/count`, { headers: scrapeHeaders }),
                axios.get(`https://friends.roblox.com/v1/users/${userId}/followers/count`, { headers: scrapeHeaders })
            ]);
            const p = profile.value?.data;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                id: p?.id, username: p?.name, display_name: p?.displayName,
                description: p?.description, is_banned: p?.isBanned,
                friends: friends.value?.data?.count || 0,
                followers: followers.value?.data?.count || 0,
                created_at: p?.created,
                url: `https://www.roblox.com/users/${p?.id}/profile`
            }});
        }

        // ── STEAM ────────────────────────────────────────────
        else if (type === 'steam') {
            // Coba resolve vanity URL dulu
            let steamId = target;
            if (!/^\d{17}$/.test(target)) {
                try {
                    const van = await axios.get(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=STEAM_API_KEY&vanityurl=${encodeURIComponent(target)}`, { headers: scrapeHeaders });
                    steamId = van.data?.response?.steamid || target;
                } catch {}
            }
            const { data } = await axios.get(`https://steamcommunity.com/profiles/${steamId}/?xml=1`, { headers: scrapeHeaders });
            // Parse XML sederhana
            const get = (tag) => data.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`))?.[1] || data.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`))?.[1] || null;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                steamid: get('steamID64'), username: get('steamID'),
                realname: get('realname'), avatar: get('avatarFull'),
                location: get('location'), status: get('onlineState'),
                member_since: get('memberSince'),
                url: `https://steamcommunity.com/profiles/${get('steamID64')}`
            }});
        }

        // ── TIKTOK ───────────────────────────────────────────
        else if (type === 'tiktok') {
            const { data: html } = await axios.get(`https://www.tiktok.com/@${encodeURIComponent(target)}`, {
                headers: { ...scrapeHeaders, 'Accept': 'text/html' }
            });
            const jsonMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
            if (!jsonMatch) return res.status(404).json({ status: false, message: "Profil TikTok tidak ditemukan." });
            const json = JSON.parse(jsonMatch[1]);
            const userData = json?.['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo;
            const u = userData?.user;
            const s = userData?.stats;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                id: u?.id, username: u?.uniqueId, nickname: u?.nickname,
                bio: u?.signature, avatar: u?.avatarLarger,
                verified: u?.verified, private: u?.privateAccount,
                region: u?.region,
                following: s?.followingCount, followers: s?.followerCount,
                likes: s?.heartCount, videos: s?.videoCount,
                url: `https://www.tiktok.com/@${u?.uniqueId}`
            }});
        }

        // ── THREADS ──────────────────────────────────────────
        else if (type === 'threads') {
            const { data: html } = await axios.get(`https://www.threads.net/@${encodeURIComponent(target)}`, {
                headers: { ...scrapeHeaders, 'Accept': 'text/html', 'sec-fetch-mode': 'navigate' }
            });
            const match = html.match(/"user":\{"pk":"(\d+)","username":"([^"]+)","full_name":"([^"]*)","is_verified":(true|false),"profile_pic_url":"([^"]+)","biography":"([^"]*)","follower_count":(\d+)/);
            if (!match) return res.status(404).json({ status: false, message: "Profil Threads tidak ditemukan." });
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                id: match[1], username: match[2], name: match[3],
                verified: match[4] === 'true',
                avatar: match[5].replace(/\\/g, ''),
                bio: match[6], followers: parseInt(match[7]),
                url: `https://www.threads.net/@${match[2]}`
            }});
        }

        // ── YOUTUBE ──────────────────────────────────────────
        else if (type === 'youtube') {
            const searchUrl = `https://www.youtube.com/@${encodeURIComponent(target)}/about`;
            const { data: html } = await axios.get(searchUrl, {
                headers: { ...scrapeHeaders, 'Accept': 'text/html' }
            });
            const ytInitData = html.match(/var ytInitialData = ([\s\S]*?);<\/script>/)?.[1];
            if (!ytInitData) return res.status(404).json({ status: false, message: "Channel YouTube tidak ditemukan." });
            const json = JSON.parse(ytInitData);
            const header = json?.header?.c4TabbedHeaderRenderer || json?.header?.pageHeaderRenderer;
            const meta = json?.metadata?.channelMetadataRenderer;
            const badges = header?.badges || [];
            const isVerified = badges.some(b => b?.metadataBadgeRenderer?.style?.includes('VERIFIED'));
            const subsText = header?.subscriberCountText?.simpleText || header?.subscriberCountText?.runs?.[0]?.text || "N/A";
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                channel_id: meta?.externalId, name: meta?.title,
                description: meta?.description?.substring(0, 300),
                avatar: header?.avatar?.thumbnails?.slice(-1)[0]?.url || null,
                banner: header?.banner?.thumbnails?.slice(-1)[0]?.url || null,
                subscribers: subsText, verified: isVerified,
                country: meta?.country || null,
                url: meta?.channelUrl || `https://youtube.com/@${target}`
            }});
        }

        // ── TWITTER/X ────────────────────────────────────────
        else if (type === 'twitter') {
            const guestToken = await axios.post('https://api.twitter.com/1.1/guest/activate.json', {}, {
                headers: {
                    ...scrapeHeaders,
                    'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
                }
            });
            const gt = guestToken.data?.guest_token;
            const { data } = await axios.get(`https://api.twitter.com/graphql/G3KGOASz96M-Qu0nwmGXNg/UserByScreenName?variables=%7B%22screen_name%22%3A%22${encodeURIComponent(target)}%22%2C%22withSafetyModeUserFields%22%3Atrue%7D&features=%7B%22hidden_profile_subscriptions_enabled%22%3Atrue%7D`, {
                headers: {
                    ...scrapeHeaders,
                    'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                    'x-guest-token': gt
                }
            });
            const u = data?.data?.user?.result?.legacy;
            const core = data?.data?.user?.result;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: {
                id: core?.rest_id, username: u?.screen_name, name: u?.name,
                bio: u?.description, location: u?.location,
                avatar: u?.profile_image_url_https?.replace('_normal', '_400x400'),
                banner: u?.profile_banner_url,
                verified: u?.verified || core?.is_blue_verified || false,
                followers: u?.followers_count, following: u?.friends_count,
                tweets: u?.statuses_count, likes: u?.favourites_count,
                created_at: u?.created_at,
                url: `https://twitter.com/${u?.screen_name}`
            }});
        }

        else {
            return res.status(400).json({ status: false, message: `Type stalker '${type}' tidak valid atau belum didukung.` });
        }

    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: `Gagal stalk ${type}: ${e.message}` });
    }
}

        // ==========================================
        // 4. KATEGORI: DOWNLOADER
        // ==========================================
        else if (kategori === 'download') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi untuk kategori Downloader!" });

            const siputzxTypes = [
                'twitter', 'douyin', 'fastdl', 'github',
                'tiktok', 'gdrive', 'savefrom', 'ummy', 'capcut'
            ];

            if (siputzxTypes.includes(type)) {
                const targetUrl = `https://api.siputzx.my.id/api/d/${type}?url=${encodeURIComponent(url)}`;
                const response = await axios.get(targetUrl);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'tiktok_v2') {
                const response = await axios.get(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }
else if (type === 'youtube_v2') {
    // Base: ytdown.to (by Ditzzx)
    if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });

    const YT_BASE = "https://app.ytdown.to";
    const YT_PAGE = `${YT_BASE}/en27/`;
    const YT_API  = `${YT_BASE}/proxy.php`;
    const YT_UA   = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

    // Step 1: warmup — ambil cookie
    const warmupRes = await axios.get(YT_PAGE, {
        headers: { "User-Agent": YT_UA, "Accept-Language": "id-ID,id;q=0.9" },
        validateStatus: () => true
    });
    const rawCookie = warmupRes.headers['set-cookie'];
    let cookieStr = "";
    if (rawCookie) {
        cookieStr = (Array.isArray(rawCookie) ? rawCookie : [rawCookie])
            .map(c => c.split(";")[0].trim()).join("; ");
    }
    const now2 = Math.floor(Date.now() / 1000);
    const ga = `_ga=GA1.1.${Math.floor(Math.random() * 1e10)}.${now2}`;
    const ga2 = `_ga_2K69M9RN1B=GS2.1.s${now2}$o1$g1$t${now2}$j49$l0$h0`;
    const finalCookie = [cookieStr, ga, ga2].filter(Boolean).join("; ");

    // Step 2: request download
    const ytBody = new URLSearchParams({ url });
    const ytRes = await axios.post(YT_API, ytBody.toString(), {
        timeout: 30000,
        headers: {
            "User-Agent": YT_UA,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": YT_BASE,
            "Referer": YT_PAGE,
            "x-requested-with": "XMLHttpRequest",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "Accept-Language": "id-ID,id;q=0.9",
            "Cookie": finalCookie
        },
        validateStatus: () => true
    });

    const ytData = ytRes.data;
    if (!ytData || ytRes.status !== 200) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal mengambil data YouTube." });
    }

    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: ytData });
}
            else if (type === 'spotify') {
                const response = await axios.get(`https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(url)}`);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }
else if (type === 'spotify-dl') {
    if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' (Spotify track URL) wajib diisi!" });
    const result = await SpotifyDl(url);
    if (!result.status) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal download lagu Spotify." });
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result });
}
            else if (type === 'fb') {
                const { data } = await axios.get('https://fdown.net');
                const $ = cheerio.load(data);
                const tokens = { v: $('input[name="token_v"]').val(), c: $('input[name="token_c"]').val(), h: $('input[name="token_h"]').val() };
                const postData = new URLSearchParams({ 'URLz': url, 'token_v': tokens.v, 'token_c': tokens.c, 'token_h': tokens.h });
                const resDl = await axios.post('https://fdown.net/download.php', postData.toString());
                const $$ = cheerio.load(resDl.data);
                return res.json({ status: true, creator: "InuuTyzDev", result: { sd: $$('#sdlink').attr('href'), hd: $$('#hdlink').attr('href') } });
            }

            else if (type === 'ig') {
                const data = new URLSearchParams({ url, v: '3', lang: 'en' });
                const response = await axios.post('https://api.downloadgram.org/media', data.toString());
                const $ = cheerio.load(response.data);
                let result = {};
                if ($('video').length) {
                    result.type = 'video';
                    result.url = $('video source').attr('src');
                    result.download_url = $('a[download]').attr('href');
                    result.thumbnail = $('video').attr('poster');
                } else if ($('img').length) {
                    result.type = 'image';
                    result.url = $('img').attr('src');
                    result.download_url = $('a[download]').attr('href');
                } else {
                    throw new Error("Media tidak ditemukan.");
                }
                return res.json({ status: true, creator: "InuuTyzDev", result });
            }

            else if (type === 'mediafire') {
                const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
                const $ = cheerio.load(data);
                const downloadLink = $('#downloadButton').attr('href');
                if (!downloadLink) throw new Error('Gagal menemukan link download.');
                return res.json({ status: true, creator: "InuuTyzDev", result: { dl: downloadLink } });
            }

            else if (type === 'snackvideo') {
                try {
                    const response = await axios.get(`https://api.tiklydown.eu.org/api/download/snack?url=${encodeURIComponent(url)}`);
                    const data = response.data;

                    if (!data || data.status !== 200) {
                        return res.status(404).json({
                            status: false,
                            creator: "InuuTyzDev",
                            message: "Video tidak ditemukan, pastikan link SnackVideo valid!"
                        });
                    }

                    const cleanData = {
                        title: data.result.title || "No Title",
                        thumbnail: data.result.thumbnail,
                        url: data.result.video || data.result.url,
                        author: data.result.author?.name || "Unknown"
                    };

                    return res.status(200).json({
                        status: true,
                        creator: "InuuTyzDev",
                        result: cleanData
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        creator: "InuuTyzDev",
                        message: "Gagal mengambil data: " + error.message
                    });
                }
            }
            else if (type === 'ig_v2') {
    // Base: engine.web.id (by Ditzzx)
    const igHeaders = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://engine.web.id",
        "Referer": "https://engine.web.id/"
    };
    const body = new URLSearchParams();
    body.append("url", url);
    const igRes = await axios.post("https://engine.web.id/download", body.toString(), {
        timeout: 60000,
        headers: igHeaders,
        responseType: "text",
        validateStatus: () => true
    });
    const $ig = cheerio.load(String(igRes.data || ""));
    const media = [];
    const seen = new Set();
    $ig("video source").each((_, el) => {
        const src = $ig(el).attr("src")?.replace(/&amp;/g, '&') || "";
        if (src && !seen.has(src)) { seen.add(src); media.push({ type: "video", url: src }); }
    });
    $ig(".media-container img").each((_, el) => {
        const src = $ig(el).attr("src")?.replace(/&amp;/g, '&') || "";
        if (src && !seen.has(src)) { seen.add(src); media.push({ type: "image", url: src }); }
    });
    for (const match of String(igRes.data).matchAll(/forceDownload\('([^']+)'/g)) {
        const u = match[1].replace(/&amp;/g, '&');
        if (!seen.has(u)) { seen.add(u); media.push({ type: u.includes('.mp4') ? 'video' : 'image', url: u }); }
    }
    if (media.length === 0) return res.status(404).json({ status: false, creator: "InuuTyzDev", message: "Media tidak ditemukan." });
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { total: media.length, media } });
}

else if (type === 'tiktok_v3') {
    // Base: tiktokdl.web.id (by Ryza)
    const tikRes = await axios.get('https://www.tiktokdl.web.id/api/tiktok', {
        params: { url },
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const d = tikRes.data;
    return res.status(200).json({
        status: true,
        creator: "InuuTyzDev",
        result: {
            id: d.id,
            description: d.description,
            author: d.author,
            duration: d.duration,
            stats: { likes: d.stats?.like, views: d.stats?.views, shares: d.stats?.share, comments: d.stats?.comment },
            music: { title: d.music?.title, author: d.music?.author, duration: d.music?.duration },
            video_url: d.videoId,
            audio_url: d.audioId
        }
    });
}

            else {
                return res.status(400).json({ status: false, message: `Type downloader '${type}' tidak valid` });
            }
        }

        // ==========================================
        // 5. KATEGORI: SEARCH
        // ==========================================
        else if (kategori === 'search') {
            const keyword = q || query || hero;

            if (!keyword) return res.status(400).json({ status: false, message: "Parameter kata kunci pencarian wajib diisi!" });

            if (type === 'spotify') {
                const response = await axios.get(`https://api.yupra.my.id/api/search/spotify?q=${encodeURIComponent(keyword)}`);
                const cleanData = response.data;
                delete cleanData.creator;
                delete cleanData.status;
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }
else if (type === 'ytsearch') {
    // NPM: @vreden/youtube_scraper (by Ditzzx)
    if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'q' wajib diisi!" });

    const yt = await import('@vreden/youtube_scraper');
    const ytResult = await yt.default.search(keyword);

    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: ytResult });
}
else if (type === 'pinterest') {
    if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'q' wajib diisi!" });

    try {
        const url = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${encodeURIComponent(keyword)}&rs=rs&data=${encodeURIComponent(JSON.stringify({
            options: {
                query: keyword,
                rs: "rs",
                scope: "pins",
                redux_normalize_feed: true,
                source_url: `/search/pins/?q=${encodeURIComponent(keyword)}&rs=rs`
            },
            context: {}
        }))}`;

        const response = await axios.get(url, {
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "x-pinterest-appstate": "active",
                "x-pinterest-pws-handler": "www/search/[scope].js",
                "x-requested-with": "XMLHttpRequest",
                "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
                "referer": "https://id.pinterest.com/",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
            },
            timeout: 15000
        });

        const results = response.data?.resource_response?.data?.results || [];

        if (results.length === 0) {
            return res.status(404).json({ status: false, creator: "InuuTyzDev", message: "Tidak ada hasil ditemukan." });
        }

        const formatted = results.map(pin => ({
            id: pin.id,
            title: pin.seo_alt_text || pin.title || "No Title",
            image: pin.images?.["474x"]?.url || pin.images?.["236x"]?.url || pin.images?.orig?.url || null,
            board: pin.board?.name || "-",
            username: pin.pinner?.username || "-",
            source: `https://id.pinterest.com/pin/${pin.id}/`
        })).filter(item => item.image !== null);

        return res.status(200).json({ status: true, creator: "InuuTyzDev", result: formatted });

    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal scrape Pinterest: " + e.message });
    }
}
else if (type === 'spotify-search') {
    if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'q' wajib diisi!" });
    const result = await spotifyClient.search(keyword);
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result });
}

else if (type === 'spotify-track') {
    if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'q' (Track ID) wajib diisi!" });
    const result = await spotifyClient.track(keyword);
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result });
}

else if (type === 'spotify-artist') {
    if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'q' (Artist ID) wajib diisi!" });
    const result = await spotifyClient.artist(keyword);
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result });
}

else if (type === 'spotify-album') {
    if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'q' (Album ID) wajib diisi!" });
    const result = await spotifyClient.album(keyword);
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result });
}

else if (type === 'spotify-playlist') {
    if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'q' (Playlist ID) wajib diisi!" });
    const result = await spotifyClient.playlist(keyword);
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result });
}
            else if (type === 'lyrics') {
                const response = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(keyword)}`);
                const data = response.data;
                if (!data || data.length === 0) return res.status(404).json({ status: false, creator: "InuuTyzDev", message: "Lirik tidak ditemukan!" });

                const lagu = data[0];
                const cleanData = {
                    judul: lagu.trackName,
                    penyanyi: lagu.artistName,
                    album: lagu.albumName,
                    durasi: lagu.duration,
                    lirik: lagu.plainLyrics,
                    lirik_sinkron: lagu.syncedLyrics
                };
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'gsm') {
                const response = await axios.get(`https://www.neoapis.xyz/api/search/gsm?query=${encodeURIComponent(keyword)}`);
                const cleanData = response.data;
                delete cleanData.creator;
                delete cleanData.status;
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'mlbb') {
                const response = await axios.get(`https://www.neoapis.xyz/api/search/mlbbdetail?hero=${encodeURIComponent(keyword)}`);
                const cleanData = response.data;
                delete cleanData.creator;
                delete cleanData.status;
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'appsearch') {
                const response = await axios.get(`https://www.neoapis.xyz/api/search/appsearch?query=${encodeURIComponent(keyword)}`);
                const cleanData = response.data;
                delete cleanData.creator;
                delete cleanData.status;
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'wikipedia') {
                const response = await axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keyword)}`);
                return res.status(200).json({
                    status: true,
                    creator: "InuuTyzDev",
                    result: {
                        judul: response.data.title,
                        deskripsi: response.data.extract,
                        thumbnail: response.data.thumbnail ? response.data.thumbnail.source : null
                    }
                });
            }

            else if (type === 'dictionary') {
                const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
            }

            else if (type === 'country') {
                const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data[0] });
            }

            else if (type === 'npm') {
                const response = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.objects });
            }

            else if (type === 'univ') {
                const response = await axios.get(`http://universities.hipolabs.com/search?name=${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
            }

            else if (type === 'nik') {
                if (keyword.length !== 16) return res.status(400).json({ status: false, message: "NIK harus 16 digit!" });
                const data = {
                    provinsi: keyword.substring(0, 2),
                    kota: keyword.substring(2, 4),
                    kecamatan: keyword.substring(4, 6),
                    tgl_lahir: keyword.substring(6, 8),
                    bln_lahir: keyword.substring(8, 10),
                    thn_lahir: keyword.substring(10, 12),
                    unique_code: keyword.substring(12, 16)
                };
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: data });
            }

            else if (type === 'books') {
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.items });
            }

            else {
                return res.status(400).json({ status: false, message: `Type search '${type}' tidak valid` });
            }
        }

        // ==========================================
        // 6. KATEGORI: INFO
        // ==========================================
        else if (kategori === 'info') {
            const keyword = q || query || searchText;

            try {
                if (type === 'bmkg') {
                    const response = await axios.get(`https://api.siputzx.my.id/api/info/bmkg`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                }

                else if (type === 'cuaca') {
                    if (!keyword) return res.status(400).json({ status: false, message: "Parameter kata kunci lokasi wajib diisi!" });
                    const response = await axios.get(`https://api.siputzx.my.id/api/info/cuaca?q=${encodeURIComponent(keyword)}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                }

                else if (type === 'jadwaltv') {
                    const tvChannel = channel || keyword;
                    if (!tvChannel) return res.status(400).json({ status: false, message: "Nama channel TV wajib diisi! (gtv, rcti, antv, dll)" });

                    const response = await axios.get(`https://api.siputzx.my.id/api/info/jadwaltv?channel=${encodeURIComponent(tvChannel)}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                }

                else if (type === 'wikipedia') {
                    if (!keyword) return res.status(400).json({ status: false, message: "Apa yang ingin dicari di Wikipedia?" });
                    const searchRes = await axios.get(`https://id.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(keyword)}`);
                    const pageId = searchRes.data.query.search[0]?.pageid;
                    if (!pageId) return res.status(404).json({ status: false, message: "Artikel tidak ditemukan." });

                    const detailRes = await axios.get(`https://id.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&pageids=${pageId}`);
                    const result = detailRes.data.query.pages[pageId];
                    return res.status(200).json({
                        status: true,
                        creator: "InuuTyzDev",
                        result: { title: result.title, extract: result.extract, wiki_url: `https://id.wikipedia.org/?curid=${pageId}` }
                    });
                }

                else if (type === 'kbbi') {
                    if (!keyword) return res.status(400).json({ status: false, message: "Masukkan kata yang ingin dicari artinya!" });
                    const response = await axios.get(`https://kbbi-api-zhirrr.vercel.app/api/kbbi?text=${encodeURIComponent(keyword)}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
                }

                else if (type === 'gempa') {
                    const response = await axios.get(`https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json`);
                    const gempa = response.data.Infogempa.gempa;
                    return res.status(200).json({
                        status: true,
                        creator: "InuuTyzDev",
                        result: {
                            waktu: `${gempa.Tanggal} | ${gempa.Jam}`,
                            magnitudo: gempa.Magnitude,
                            kedalaman: gempa.Kedalaman,
                            wilayah: gempa.Wilayah,
                            potensi: gempa.Potensi,
                            map: `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`
                        }
                    });
                }

                else {
                    return res.status(404).json({ status: false, message: `Endpoint '${type}' tidak tersedia di kategori info.` });
                }
            } catch (e) {
                return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server penyedia data." });
            }
        }

        // ==========================================
        // 7. KATEGORI: GENERATOR
        // ==========================================
        else if (kategori === 'generator') {

            if (type === 'qr') {
                const isiQR = text || q || 'https://api.inuutyz.web.id';
                const warnaQR = parseColor(color, '00f3ff');
                const backgroundQR = parseColor(bg, '0b0b0b');

                const qr = new QRCode({
                    content: isiQR,
                    padding: 4,
                    width: 256,
                    height: 256,
                    color: `#${warnaQR}`,
                    background: `#${backgroundQR}`,
                    join: true
                });

                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                return res.status(200).send(qr.svg());
            }

            else if (type === 'captcha') {
                const diff = req.query.difficulty || 'medium';
                const colorCaptcha = parseColor(req.query.color, '8a2be2');

                let max = diff === 'hard' ? 100 : diff === 'easy' ? 10 : 50;
                let num1 = Math.floor(Math.random() * max) + 1;
                let num2 = Math.floor(Math.random() * max) + 1;
                let answer = num1 + num2;

                let noise = '';
                for (let i = 0; i < 7; i++) {
                    noise += `<line x1="${Math.random() * 200}" y1="${Math.random() * 80}" x2="${Math.random() * 200}" y2="${Math.random() * 80}" stroke="#${colorCaptcha}" stroke-width="2" opacity="0.6"/>`;
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

            else if (type === 'avatar') {
                const seedVal = req.query.seed || 'InuuTyzDev';
                const colorAvatar = parseColor(req.query.color, '00f3ff');

                const hash = crypto.createHash('md5').update(seedVal).digest('hex');

                let rects = '';
                for (let i = 0; i < 15; i++) {
                    const isSolid = parseInt(hash[i], 16) % 2 === 0;
                    if (isSolid) {
                        const col = i % 3;
                        const row = Math.floor(i / 3);
                        rects += `<rect x="${col * 20}" y="${row * 20}" width="20" height="20" fill="#${colorAvatar}"/>`;
                        if (col !== 2) {
                            rects += `<rect x="${(4 - col) * 20}" y="${row * 20}" width="20" height="20" fill="#${colorAvatar}"/>`;
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

            else if (type === 'license') {
                const fmt = req.query.format || 'XXXX-XXXX-XXXX-XXXX';
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

                let key = '';
                for (let i = 0; i < fmt.length; i++) {
                    if (fmt[i] === 'X' || fmt[i] === 'x') {
                        key += chars.charAt(Math.floor(Math.random() * chars.length));
                    } else {
                        key += fmt[i];
                    }
                }

                return res.status(200).json({
                    status: true,
                    creator: "InuuTyzDev",
                    result: { format_request: fmt, license_key: key }
                });
            }

            else if (type === 'statbar') {
                const labelVal = req.query.label || 'API HEALTH';
                const valueVal = Math.min(Math.max(parseInt(req.query.value) || 100, 0), 100);
                const colorBar = parseColor(req.query.color, '8a2be2');
                const bgBar = parseColor(req.query.bg, '111111');

                const svg = `
                <svg width="350" height="40" xmlns="http://www.w3.org/2000/svg">
                    <rect width="350" height="40" fill="#${bgBar}" rx="6" stroke="#333" stroke-width="1"/>
                    <rect x="5" y="5" width="${(valueVal / 100) * 340}" height="30" fill="#${colorBar}" rx="4" opacity="0.85"/>
                    <text x="15" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" letter-spacing="1">${labelVal.toUpperCase()}</text>
                    <text x="335" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" text-anchor="end">${valueVal}%</text>
                </svg>`;

                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'no-cache');
                return res.status(200).send(svg);
            }

            else if (type === 'placeholder') {
                const wVal = parseInt(req.query.w) || 300;
                const hVal = parseInt(req.query.h) || 300;
                const bgPh = parseColor(req.query.bg, '1a1a2e');
                const colorPh = parseColor(req.query.color, '8a2be2');
                const textPh = req.query.text || `${wVal} x ${hVal}`;
                const fontSize = Math.max(12, Math.min(wVal, hVal) / 8);

                const svg = `
                <svg width="${wVal}" height="${hVal}" viewBox="0 0 ${wVal} ${hVal}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="${wVal}" height="${hVal}" fill="#${bgPh}"/>
                    <text x="50%" y="50%" fill="#${colorPh}" font-family="Orbitron, Arial, sans-serif" font-size="${fontSize}" font-weight="bold" dominant-baseline="middle" text-anchor="middle">
                        ${textPh}
                    </text>
                </svg>`;

                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'public, max-age=31536000');
                return res.status(200).send(svg);
            }

            else if (type === 'wave') {
                const c1 = parseColor(req.query.color1, '8a2be2');
                const c2 = parseColor(req.query.color2, '00f3ff');
                const bgWave = parseColor(req.query.bg, '050505');

                const svg = `
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#${c1}" />
                            <stop offset="100%" stop-color="#${c2}" />
                        </linearGradient>
                    </defs>
                    <rect width="1440" height="320" fill="#${bgWave}"/>
                    <path fill="url(#waveGrad)" fill-opacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,80C960,64,1056,96,1152,112C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>`;

                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                return res.status(200).send(svg);
            }

            else if (type === 'token') {
                const lenVal = parseInt(req.query.length) || 16;
                const useSymbols = req.query.symbols === 'true';
                const safeLength = Math.min(lenVal, 256);

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

            else {
                return res.status(404).json({ status: false, message: `Type generator '${type}' tidak ditemukan!` });
            }
        }

        // ==========================================
        // 8. KATEGORI: STICKER
        // ==========================================
        else if (kategori === 'sticker') {
            const keyword = q || query;

            const axiosConfig = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                },
                timeout: 30000
            };

            if (type === 'stickerly') {
                if (!keyword) return res.status(400).json({ status: false, message: "Query (q) wajib diisi!" });

                try {
                    const searchUrl = `https://sticker.ly/api/search/pack?keyword=${encodeURIComponent(keyword)}&size=20`;
                    const response = await axios.get(searchUrl, axiosConfig);

                    const packs = response.data.result?.stickerPackList || [];
                    const result = packs.map(pack => ({
                        name: pack.name,
                        author: pack.authorName,
                        trayImage: pack.trayImageUri,
                        stickers: pack.stickers.map(s => s.stickerUri)
                    }));

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: result });
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal scraping Stickerly secara mandiri." });
                }
            }

            else if (type === 'emojimix') {
                const { emoji1, emoji2 } = req.query;
                if (!emoji1 || !emoji2) return res.status(400).json({ status: false, message: "Kirim emoji1 dan emoji2!" });

                try {
                    const targetUrl = `https://api.vany.my.id/api/maker/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
                    const response = await axios.get(targetUrl, { ...axiosConfig, responseType: 'arraybuffer' });

                    res.setHeader('Content-Type', 'image/png');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal membuat emojimix." });
                }
            }

            else if (type === 'qc') {
                if (!text || !name) return res.status(400).json({ status: false, message: "Teks dan Nama wajib!" });
                try {
                    const avatar = avatarUrl || "https://i.pravatar.cc/300";
                    const colorQc = bg ? (bg.startsWith('#') ? bg : `#${bg}`) : "#1f2c33";

                    const targetUrl = `https://api.paxsenix.biz.id/api/maker/qc?text=${encodeURIComponent(text)}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar)}&hex=${encodeURIComponent(colorQc)}`;
                    const response = await axios.get(targetUrl, { ...axiosConfig, responseType: 'arraybuffer' });

                    res.setHeader('Content-Type', 'image/png');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal memproses QC." });
                }
            }

            else if (type === 'brat') {
                if (!text) return res.status(400).json({ status: false, message: "Teks wajib!" });
                try {
                    const targetUrl = `https://api.paxsenix.biz.id/api/maker/brat?text=${encodeURIComponent(text)}`;
                    const response = await axios.get(targetUrl, { ...axiosConfig, responseType: 'arraybuffer' });

                    res.setHeader('Content-Type', 'image/png');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal membuat Brat." });
                }
            }

            else {
                return res.status(404).json({ status: false, message: `Type sticker '${type}' tidak ditemukan!` });
            }
        }

        // ==========================================
        // 9. KATEGORI: EPHOTO
        // ==========================================
        else if (kategori === 'ephoto') {
            const textInput = q || text || query;

            const listEffect = [
                '1917style', 'advancedglow', 'blackpinklogo', 'blackpinkstyle', 'cartoonstyle',
                'deletingtext', 'dragonball', 'effectclouds', 'flag3dtext', 'flagtext',
                'freecreate', 'galaxy', 'galaxywallpaper', 'glitchtext', 'glowingtext',
                'gradienttext', 'lighteffects', 'logomaker', 'luxurygold', 'makingneon',
                'neonglitch', 'papercutstyle', 'pixelglitch', 'royaltext', 'sandsummer',
                'summerbeach', 'typographytext', 'underwatertext', 'watercolortext', 'writetext'
            ];

            if (!textInput) return res.status(400).json({ status: false, message: "Parameter teks wajib diisi!" });

            if (listEffect.includes(type)) {
                try {
                    const targetUrl = `https://api.cuki.biz.id/api/ephoto/${type}?apikey=${apiKeyCuki}&query=${encodeURIComponent(textInput)}`;

                    const response = await axios.get(targetUrl, {
                        headers: { 'x-api-key': apiKeyCuki },
                        responseType: 'arraybuffer'
                    });

                    res.setHeader('Content-Type', 'image/jpeg');
                    res.setHeader('Cache-Control', 'public, max-age=86400');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal memproses gambar: " + e.message });
                }
            } else {
                return res.status(404).json({ status: false, message: `Efek '${type}' tidak ditemukan.` });
            }
        }

        // ==========================================
        // 10. KATEGORI: KOMIK
        // ==========================================
        else if (kategori === 'komik') {

            if (type === 'search') {
                const keyword = q || query || text;
                if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'query' (judul komik) wajib diisi!" });

                try {
                    const targetUrl = `https://api.cuki.biz.id/api/komik/komikindo-search?apikey=${apiKeyCuki}&query=${encodeURIComponent(keyword)}`;
                    const response = await axios.get(targetUrl);

                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal mencari komik: " + e.message });
                }
            }

            else if (type === 'detail') {
                if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' komik wajib diisi!" });

                try {
                    const targetUrl = `https://api.cuki.biz.id/api/komik/komikindo-detail?apikey=${apiKeyCuki}&url=${encodeURIComponent(url)}`;
                    const response = await axios.get(targetUrl);

                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal mengambil detail komik: " + e.message });
                }
            }

            else if (type === 'chapter') {
    if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' chapter wajib diisi!" });

    try {
        // 1. Lakukan request menggunakan 'got' dengan fitur HTTP/2 aktif
        const response = await got(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'referer': 'https://komikindo.ch/',
                'cache-control': 'max-age=0',
                'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1'
            },
            http2: true, // <-- Kunci utama untuk mengelabui Cloudflare
            timeout: { request: 10000 },
            retry: { limit: 1 }
        });

        // 2. Load HTML menggunakan cheerio
        const $ = cheerio.load(response.body); // Catatan: kalau 'got' pakainya .body, bukan .data
        const images = [];
        
        // 3. Scraping element gambar
        $('#readerarea img').each((index, element) => {
            const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy-src');
            
            if (src && !src.includes('loader') && src.startsWith('http')) {
                images.push(src.trim());
            }
        });

        const chapterTitle = $('.entry-title').text().trim() || $('h1').text().trim();

        if (images.length === 0) {
            return res.status(403).json({ 
                status: false, 
                message: "Gagal mengambil gambar. Struktur HTML berubah atau proteksi terlalu ketat." 
            });
        }

        return res.status(200).json({ 
            status: true, 
            creator: "InuuTyzDev", 
            result: {
                title: chapterTitle,
                chapter_url: url,
                images: images
            } 
        });

    } catch (e) {
        // Tangani jika tetap diblokir
        if (e.response && (e.response.statusCode === 403 || e.response.statusCode === 503)) {
            return res.status(403).json({ 
                status: false, 
                message: "Scraper HTTP/2 masih terdeteksi oleh Cloudflare Komikindo. Perlu taktik alternatif." 
            });
        }
        return res.status(500).json({ status: false, message: "Gagal mengambil isi chapter: " + e.message });
    }
}



            else {
                return res.status(404).json({ status: false, message: `Type komik '${type}' tidak ditemukan!` });
            }
        }

        // ==========================================
        // 11. KATEGORI: MEME
        // ==========================================
        else if (kategori === 'meme') {
            const listMeme = [
                'dogecheems', 'hotline', 'jarvis', 'majulu',
                'pelajaran', 'pilihan', 'squidwindow', 'twobuttons'
            ];

            if (listMeme.includes(type)) {
                if (!text1 && !text) {
                    return res.status(400).json({ status: false, message: "Minimal parameter 'text1' atau 'text' wajib diisi!" });
                }

                try {
                    let targetUrl = `https://api.cuki.biz.id/api/canvas/meme/${type}?apikey=${apiKeyCuki}`;

                    if (text) targetUrl += `&text=${encodeURIComponent(text)}`;
                    if (text1) targetUrl += `&text1=${encodeURIComponent(text1)}`;
                    if (text2) targetUrl += `&text2=${encodeURIComponent(text2)}`;
                    if (text3) targetUrl += `&text3=${encodeURIComponent(text3)}`;

                    const response = await axios.get(targetUrl, {
                        headers: { 'x-api-key': apiKeyCuki },
                        responseType: 'arraybuffer'
                    });

                    res.setHeader('Content-Type', 'image/png');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: `Gagal membuat meme ${type}: ` + e.message });
                }
            } else {
                return res.status(404).json({
                    status: false,
                    message: `Type meme '${type}' tidak ditemukan!`,
                    available_memes: listMeme
                });
            }
        }

        // ==========================================
        // 12. KATEGORI: AI-IMAGE
        // ==========================================
        else if (kategori === 'ai-image') {
            const imageUrl = url || q || query;
            const textPrompt = prompt || q || query;

            const axiosConfigAI = {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 45000
            };

            const directImageTypes = ['torealistic', 'tocinematic', 'tofigure', 'toghibli', 'toanime', 'deepai'];

            if (directImageTypes.includes(type)) {
                if (!imageUrl && !textPrompt) return res.status(400).json({ status: false, message: "Parameter input wajib diisi!" });

                try {
                    const param = directImageTypes.slice(0, 5).includes(type) ? `url=${encodeURIComponent(imageUrl)}` : `prompt=${encodeURIComponent(textPrompt)}`;
                    const targetUrl = `https://www.neoapis.xyz/api/ai-image/${type}?${param}`;

                    const response = await axios.get(targetUrl, { ...axiosConfigAI, responseType: 'arraybuffer' });

                    res.setHeader('Content-Type', 'image/jpeg');
                    return res.status(200).send(response.data);
                } catch (error) {
                    return res.status(500).json({ status: false, message: `Gagal memproses gambar ${type}` });
                }
            }

            else if (type === 'ailabs') {
                if (!textPrompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

                try {
                    const targetUrl = `https://www.neoapis.xyz/api/ai-image/ailabs?prompt=${encodeURIComponent(textPrompt)}`;
                    const response = await axios.get(targetUrl, axiosConfigAI);
                    const data = response.data;
                    const finalImage = data.result?.url || data.result || data.url;

                    return res.status(200).json({
                        status: true,
                        creator: "InuuTyzDev",
                        result: { image_url: finalImage }
                    });
                } catch (error) {
                    return res.status(500).json({ status: false, message: "Gagal generate JSON ailabs" });
                }
            }
else if (type === 'deepaitxt2img') {
    // Base: deepai.org text2img (by Ditzzx)
    if (!prompt && !q) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });
    const imgPrompt = prompt || q;

    // Generate API key dengan MD5-like hash
    function md5Like(input) {
        const a = [];
        for (let b = 0; b < 64; ) { a[b] = 0 | (4294967296 * Math.sin(++b % Math.PI)); }
        let d, e, f, g = [(d = 1732584193), (e = 4023233417), ~d, ~e];
        const h = [];
        let l = unescape(encodeURI(input)) + "\u0080";
        let k = l.length;
        let c = ((--k / 4 + 2) | 15);
        h[--c] = 8 * k;
        while (~k) { h[k >> 2] |= l.charCodeAt(k) << (8 * k--); }
        for (let b = 0, l = 0; b < c; b += 16) {
            for (k = g; l < 64; k = [(f = k[3]), d + (((f = k[0] + [d & e | ~d & f, f & d | ~f & e, d ^ e ^ f, e ^ (d | ~f)][(k = l >> 4)] + a[l] + ~~h[b | ([l, 5 * l + 1, 3 * l + 5, 7 * l][k] & 15)]) << (k = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * k + (l++ % 4)])) | (f >>> -k)), d, e]) { d = k[1] | 0; e = k[2]; }
            for (l = 4; l; ) { g[--l] += k[l]; }
        }
        let result = "";
        for (let l = 0; l < 32; ) { result += ((g[l >> 3] >> (4 * (1 ^ l++))) & 15).toString(16); }
        return result.split("").reverse().join("");
    }

    const ua = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";
    const rnd = Math.round(Math.random() * 100000000000).toString();
    const apiKey = `tryit-${rnd}-${md5Like(ua + md5Like(ua + md5Like(ua + rnd + "hackers_become_a_little_stinkier_every_time_they_hack")))}`;

    const daForm = new FormData();
    daForm.append("text", imgPrompt);
    daForm.append("width", "640");
    daForm.append("height", "640");
    daForm.append("image_generator_version", "hd");
    daForm.append("quality", "true");
    daForm.append("generation_source", "img");

    const daRes = await axios.post("https://api.deepai.org/api/text2img", daForm, {
        timeout: 60000,
        headers: { "api-key": apiKey, "User-Agent": ua, "Origin": "https://deepai.org", ...daForm.getHeaders() }
    });

    const imgUrl = daRes.data?.output_url;
    if (!imgUrl) return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Gagal generate gambar DeepAI." });
    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { model: "deepai-text2img", prompt: imgPrompt, image_url: imgUrl } });
}
            else {
                return res.status(404).json({ status: false, message: `Type '${type}' tidak ditemukan.` });
            }
        }

        // ==========================================
        // 13. KATEGORI: FUN
        // ==========================================
        else if (kategori === 'fun') {
            const { name: funName, name1, name2, lang } = req.query;
            const inputTeks = text || q || query;

            const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
            const getPersen = () => Math.floor(Math.random() * 101);

            try {
                if (type === 'cekkhodam') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const khodamList = [
                        "Macan Putih", "Naga Sakti", "Genderuwo", "Tuyul Kesasar", "Batu Bata",
                        "Sapu Lidi", "Kuntilanak Merah", "Jin Qorin", "Panci Gosong", "Ular Kobra",
                        "Singa Paddle Pop", "Kipas Angin Cosmos", "Kosong (Tidak ada khodam)",
                        "Knalpot Racing", "Sendal Jepit", "Nyamuk DBD", "Kucing Oyen", "Buaya Darat",
                        "Harimau Sumatera", "Kuntilanak Disko", "Pocong Ngesot", "Kambing Hitam"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, khodam: getRandom(khodamList) } });
                }

                else if (type === 'teskecocokan') {
                    if (!name1 || !name2) return res.status(400).json({ status: false, message: "Parameter 'name1' & 'name2' wajib!" });
                    const persen = getPersen();
                    let pesan = persen > 80 ? "Sangat serasi! Jodoh dunia akhirat." :
                        persen > 50 ? "Lumayan cocok, tapi butuh banyak kompromi." :
                            persen > 20 ? "Banyak rintangan, sering beda pendapat." :
                                "Mending cari yang lain aja deh, agak susah ini mah.";
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama1: name1, nama2: name2, kecocokan: `${persen}%`, pesan } });
                }

                else if (type === 'apakah') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const jawaban = ["Iya", "Tidak", "Bisa jadi", "Mungkin saja", "Tentu saja tidak", "Coba tanya lagi besok", "Sudah pasti!", "Mustahil!", "Yakin 100% iya", "Jangan ngarep deh"];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { pertanyaan: inputTeks, jawaban: getRandom(jawaban) } });
                }

                else if (type === 'kapan') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const waktu = ["Besok", "Lusa", "Bulan depan", "Tahun depan", "5 tahun lagi", "Hari ini juga", "Tidak akan pernah", "Minggu depan", "Nanti sore", "Pas kiamat"];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { pertanyaan: inputTeks, jawaban: getRandom(waktu) } });
                }

                else if (type === 'bisakah') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const jawaban = ["Bisa banget!", "Wah, susah sih itu", "Tergantung amal ibadah", "Mimpi aja dulu", "Pasti bisa kalau usaha", "Mustahil!", "Coba aja sendiri", "Tanya bapakmu gih"];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { pertanyaan: inputTeks, jawaban: getRandom(jawaban) } });
                }

                else if (type === 'bagaimanakah') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const jawaban = ["Sangat buruk", "Biasa aja", "Luar biasa baik!", "Mengerikan...", "Lumayan lah", "Tidak bisa dijelaskan dengan kata-kata", "Bikin geleng-geleng kepala", "Sempurna!"];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { pertanyaan: inputTeks, jawaban: getRandom(jawaban) } });
                }

                else if (['cekganteng', 'cekcantik', 'cekbucin', 'cekstres', 'cekwibu', 'cekpelit', 'cekjomblo'].includes(type)) {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const persen = getPersen();
                    const kategoriNama = type.replace('cek', '');
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, kategori: kategoriNama.toUpperCase(), skor: `${persen}%` } });
                }

                else if (type === 'ceksifat') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const sifatList = [
                        "Suka ngambek tapi penyayang", "Caper tingkat dewa", "Dewasa dan pengertian", "Childish banget",
                        "Sering overthinking", "Santuy abis", "Pemarah tapi cepat reda", "Pendiam tapi asyik",
                        "Suka gibah", "Loyal ke teman", "Cemburuan parah", "Pemaaf banget"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, sifat: getRandom(sifatList) } });
                }

                else if (type === 'pekerjaan') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const kerjaList = [
                        "CEO Perusahaan Top", "Tukang Parkir Indomaret", "Programmer Handal", "Pawang Hujan",
                        "Presiden", "Penjual Seblak", "Atlet E-Sport", "Gamer Rebahan", "Anggota DPR",
                        "Kang Paket", "Youtuber Sukses", "Pengangguran Sukses"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, masa_depan: getRandom(kerjaList) } });
                }

                else if (type === 'jodohku') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const ciriJodoh = [
                        "Orang terdekat yang sering kamu abaikan", "Seseorang dari masa lalumu",
                        "Orang kaya raya dari negara tetangga", "Teman sekelas/sekerjamu sendiri",
                        "Ketemu di jalan pas lagi hujan", "Artis K-Pop terkenal", "Masih dirahasiakan semesta"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, prediksi_jodoh: getRandom(ciriJodoh) } });
                }

                else if (type === 'rate') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const nilai = getPersen();
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { hal_dinilai: inputTeks, nilai: `${nilai}/100` } });
                }

                else if (type === 'faktarandom') {
                    const faktaList = [
                        "Madu tidak akan pernah basi.",
                        "Sapi bisa tidur berdiri, tapi mereka hanya bisa bermimpi jika berbaring.",
                        "Jantung udang terletak di kepalanya.",
                        "Siput bisa tidur selama 3 tahun.",
                        "Sidik jari koala sangat mirip dengan sidik jari manusia.",
                        "Babi tidak bisa melihat ke langit karena bentuk lehernya.",
                        "Kecoa bisa hidup berminggu-minggu tanpa kepala.",
                        "Lidah jerapah panjangnya bisa mencapai 50 cm."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(faktaList) });
                }

                else if (type === 'gombalan') {
                    const gombalList = [
                        "Cita-citaku cuma satu, pengen jadi orang yang selalu ada di hati kamu.",
                        "Kamu tahu bedanya kamu sama Monas? Kalau Monas milik negara, kalau kamu milik aku.",
                        "Bapak kamu tukang kebun ya? Soalnya kamu telah menaburkan benih cinta di hatiku.",
                        "Aku rela ikut lomba lari keliling dunia, asalkan garis finishnya itu kamu.",
                        "Kalau aku jadi gubernur, aku bakal ubah ibu kota jadi nama kamu.",
                        "Selain ada garuda di dadaku, di dadaku juga selalu ada kamu.",
                        "Kamu itu kaya pelangi ya, indahnya cuma sesaat tapi bikin senyum terus."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(gombalList) });
                }

                else if (type === 'pantun') {
                    const pantunList = [
                        "Beli paku di pasar malam, Kamu ngaku sayang tapi diam-diam.",
                        "Jalan-jalan ke kota Paris, Lihat cewek manis eh ternyata berkumis.",
                        "Burung perkutut burung kutilang, Kamunya cemberut akunya hilang.",
                        "Buah duku buah manggis, Eh lu ngaku manis padahal bau amis.",
                        "Makan duku di atas papan, Mukamu lucu tapi kayak tampan."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(pantunList) });
                }

                else if (type === 'truth') {
                    const truthList = [
                        "Kapan terakhir kali kamu ngompol di celana?",
                        "Siapa orang yang paling sering kamu kepoin di sosmed?",
                        "Pernahkah kamu diam-diam menyukai teman sekelas?",
                        "Apa kebohongan terbesar yang pernah kamu katakan ke orang tuamu?",
                        "Siapa nama mantan yang paling susah kamu lupain?",
                        "Pernah gak mandi seharian pas hari libur?"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(truthList) });
                }

                else if (type === 'dare') {
                    const dareList = [
                        "Kirim pesan 'Aku sayang kamu' ke mantanmu sekarang!",
                        "Buat instastory nyanyi lagu Balonku pakai nada sedih.",
                        "Pakai kaus kaki terbalik sampai besok pagi.",
                        "Chat random kontak nomor urutan ke-7 di HP kamu dan bilang 'Aku kangen'.",
                        "Komen 'Cantik/Ganteng banget' di postingan IG orang yang gak kamu kenal.",
                        "Telepon orang tuamu dan bilang 'Terima kasih sudah melahirkanku' tanpa ketawa."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(dareList) });
                }

                else if (type === 'quotes') {
                    const quotesList = [
                        "Lebih baik dibenci karena menjadi diri sendiri, daripada dicintai karena menjadi orang lain.",
                        "Kadang kita harus rela melepaskan untuk melihatnya bahagia bersama yang lain.",
                        "Hujan selalu kembali jatuh meskipun ia tahu rasanya sakit.",
                        "Mencintaimu adalah patah hati yang paling aku sengaja.",
                        "Kita adalah dua orang yang saling mendoakan, tapi tak pernah ditakdirkan bersama."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(quotesList) });
                }

                else if (type === 'katabijak') {
                    const bijakList = [
                        "Jangan menyerah, penderitaanmu hari ini adalah kekuatanmu esok hari.",
                        "Menyerah bukan berarti lemah, terkadang kamu sudah cukup kuat untuk melepaskan.",
                        "Masa depan adalah milik mereka yang percaya pada keindahan mimpi-mimpi mereka.",
                        "Kegagalan adalah bumbu yang memberikan kesuksesan rasanya.",
                        "Lakukan apa yang bisa kamu lakukan hari ini, jangan tunda sampai besok."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(bijakList) });
                }

                else if (type === 'tebakumur') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const umur = Math.floor(Math.random() * (80 - 10 + 1)) + 10;
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, tebakan_umur: `${umur} Tahun`, komentar: umur > 50 ? "Wah udah tuwir yak" : umur < 17 ? "Masih bocil rupanya" : "Lagi masa emasnya nih!" } });
                }

                else if (type === 'tts') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const bahasa = lang || 'id';
                    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(inputTeks)}&tl=${bahasa}&client=tw-ob`;

                    const response = await axios.get(googleTtsUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        responseType: 'arraybuffer'
                    });

                    res.setHeader('Content-Type', 'audio/mpeg');
                    return res.status(200).send(response.data);
                }

                else {
                    return res.status(404).json({ status: false, message: `Endpoint fun '${type}' belum tersedia.` });
                }

            } catch (error) {
                return res.status(500).json({ status: false, message: "Server error", detail: error.message });
            }
        }

        // ==========================================
        // 14. KATEGORI: ISLAM
        // ==========================================
        else if (kategori === 'islam') {
            try {
                if (type === 'quran') {
                    if (!surah || !ayat) return res.status(400).json({ status: false, message: "Parameter 'surah' dan 'ayat' wajib diisi!" });
                    const response = await axios.get(`https://equran.id/api/v2/surat/${surah}`);
                    const dataAyat = response.data.data.ayat.find(a => a.nomorAyat == ayat);
                    if (!dataAyat) return res.status(404).json({ status: false, message: "Ayat tidak ditemukan." });
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: dataAyat });

                } else if (type === 'jadwalsholat') {
                    if (!q) return res.status(400).json({ status: false, message: "Masukkan nama kota pada parameter 'q'!" });
                    const searchKota = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${q}`);
                    if (searchKota.data.data.length === 0) return res.status(404).json({ status: false, message: "Kota tidak ditemukan." });
                    const idKota = searchKota.data.data[0].id;
                    const date = new Date().toISOString().split('T')[0].replace(/-/g, '/');
                    const jadwal = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${idKota}/${date}`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: jadwal.data.data });

                } else if (type === 'tebak-nabi') {
                    const response = await axios.get(`https://raw.githubusercontent.com/Pandaid-Official/Pandaid-Lib/main/islam/kisahnabi.json`);
                    const data = response.data;
                    const nabiAcak = data[Math.floor(Math.random() * data.length)];
                    return res.status(200).json({
                        status: true, creator: "InuutyzDev",
                        result: {
                            pertanyaan: "Siapakah nabi yang memiliki mukjizat berikut?",
                            clue: nabiAcak.description.substring(0, 200) + "...",
                            jawaban: nabiAcak.name
                        }
                    });

                } else if (type === 'doa') {
                    const response = await axios.get(`https://doa-doa-harian-api.vercel.app/adsyatir73/all`);
                    const doaAcak = response.data.data[Math.floor(Math.random() * response.data.data.length)];
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: doaAcak });

                } else if (type === 'hadits') {
                    const kitab = q || 'bukhari';
                    const nomor = ayat || 1;
                    const response = await axios.get(`https://api.hadith.gading.dev/books/${kitab}/${nomor}`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data.data });

                } else if (type === 'asmaulhusna') {
                    const response = await axios.get(`https://raw.githubusercontent.com/pajang/pajang-data/master/asmaul-husna.json`);
                    if (q) {
                        const husna = response.data.find(h => h.index == q);
                        if (!husna) return res.status(404).json({ status: false, message: "Nomor Asmaul Husna tidak ditemukan." });
                        return res.status(200).json({ status: true, creator: "InuutyzDev", result: husna });
                    }
                    const randomHusna = response.data[Math.floor(Math.random() * response.data.length)];
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: randomHusna });

                } else if (type === 'niatsholat') {
                    const response = await axios.get(`https://raw.githubusercontent.com/niat-sholat-api/niat-sholat-api/main/data/niat-sholat.json`);
                    if (q) {
                        const niat = response.data.find(n => n.name.toLowerCase().includes(q.toLowerCase()));
                        if (!niat) return res.status(404).json({ status: false, message: "Niat sholat tidak ditemukan." });
                        return res.status(200).json({ status: true, creator: "InuutyzDev", result: niat });
                    }
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data });

                } else if (type === 'ayatkursi') {
                    const response = await axios.get(`https://pencari-hadits-api.vercel.app/api/ayatkursi`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data.data });

                } else if (type === 'tahlil') {
                    const response = await axios.get(`https://raw.githubusercontent.com/Zhirrr/islamic-rest-api-indonesian/refs/heads/main/data/tahlil.json`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data.data });

                } else if (type === 'wirid') {
                    const response = await axios.get(`https://raw.githubusercontent.com/Zhirrr/islamic-rest-api-indonesian/refs/heads/main/data/wirid.json`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data.data });

                } else if (type === 'doapahlawan') {
                    const response = await axios.get(`https://doa-doa-harian-api.vercel.app/adsyatir73/all`);
                    const pahlawan = response.data.data.find(d => d.doa.toLowerCase().includes('pahlawan') || d.doa.toLowerCase().includes('arwah'));
                    if (!pahlawan) return res.status(404).json({ status: false, message: "Doa spesifik pahlawan tidak ditemukan, silakan gunakan fitur 'doa' umum." });
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: pahlawan });

                } else if (type === 'daftarsurat') {
                    const response = await axios.get(`https://equran.id/api/v2/surat`);
                    let cleanData = response.data.data || response.data;
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });

                } else if (type === 'artisurat' || type === 'tafsir') {
                    if (!surah) return res.status(400).json({ status: false, message: "Parameter 'surah' (nomor surat) wajib diisi!" });
                    const response = await axios.get(`https://equran.id/api/v2/tafsir/${surah}`);
                    let cleanData = response.data.data || response.data;
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });

                } else if (type === 'audiosurat') {
                    if (!surah) return res.status(400).json({ status: false, message: "Parameter 'surah' wajib diisi!" });
                    const response = await axios.get(`https://equran.id/api/v2/surat/${surah}`);
                    const data = response.data.data;
                    return res.status(200).json({
                        status: true, creator: "InuuTyzDev",
                        result: { nama_surat: data.namaLatin, audio_full: data.audioFull }
                    });

                } else if (type === 'zikir') {
                    const waktu = q === 'petang' ? 'petang' : 'pagi';
                    const response = await axios.get(`https://raw.githubusercontent.com/Zhirrr/islamic-rest-api-indonesian/refs/heads/main/data/zikir${waktu}.json`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.data });

                } else if (type === 'puasa') {
                    const listPuasa = [
                        { niat: "Ramadhan", bacaan: "Nawaitu shauma ghadin 'an ada'i fardhi syahri Ramadhana hadzihis sanati lillahi ta'ala." },
                        { niat: "Senin", bacaan: "Nawaitu shauma yaumil itsnaini sunnatan lillahi ta'ala." },
                        { niat: "Kamis", bacaan: "Nawaitu shauma yaumil khamisi sunnatan lillahi ta'ala." },
                        { niat: "Buka Puasa", bacaan: "Allahumma laka shumtu wa bika amantu wa 'ala rizqika afthartu birahmatika ya arhamar rahimin." }
                    ];
                    if (q) {
                        const hasil = listPuasa.find(p => p.niat.toLowerCase().includes(q.toLowerCase()));
                        if (hasil) return res.status(200).json({ status: true, creator: "InuuTyzDev", result: hasil });
                    }
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: listPuasa });

                } else if (type === 'kisahnabi') {
                    if (!q) return res.status(400).json({ status: false, message: "Masukkan nama nabi pada parameter 'q'!" });
                    const response = await axios.get(`https://raw.githubusercontent.com/Pandaid-Official/Pandaid-Lib/main/islam/kisahnabi.json`);
                    const kisah = response.data.find(n => n.name.toLowerCase() === q.toLowerCase());
                    if (!kisah) return res.status(404).json({ status: false, message: "Kisah nabi tidak ditemukan." });
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: kisah });

                } else {
                    return res.status(404).json({ status: false, message: `Type islam '${type}' tidak ditemukan!` });
                }
            } catch (e) {
                return res.status(500).json({ status: false, message: "Internal Server Error" });
            }
        }

        // ==========================================
        // 15. KATEGORI: BERITA
        // ==========================================
        else if (kategori === 'berita') {
    const creator = "InuuTyzDev";

    // Fungsi helper untuk mengambil data RSS XML dan mengubahnya menjadi JSON rapi
    const parseRSS = async (url) => {
        try {
            const { data } = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
                },
                timeout: 10000
            });
            
            // Menggunakan xml2js.Parser() atau new xml2js.default.Parser() sebagai fallback aman di Vercel ES Module
            const ParserNode = xml2js.Parser || (xml2js.default && xml2js.default.Parser);
            if (!ParserNode) throw new Error("xml2js Parser tidak ditemukan.");

            const parser = new ParserNode({ explicitArray: false, mergeAttrs: true });
            const parsed = await parser.parseStringPromise(data);
            
            // Ambil daftar artikel standar RSS (masuk ke channel.item)
            const items = parsed?.rss?.channel?.item || [];
            const articles = Array.isArray(items) ? items : [items];

            // Mapping struktur data agar konsisten dan bersih
            return articles.map(item => {
                // Cari url gambar/thumbnail dari berbagai jenis tag RSS yang umum
                const thumbnail = item.enclosure?.url || 
                                  item['media:content']?.url || 
                                  item['media:thumbnail']?.url || "";

                return {
                    title: item.title || "",
                    link: item.link || item.guid?._ || "",
                    pubDate: item.pubDate || item.isoDate || "",
                    description: item.description ? item.description.replace(/<[^>]*>/g, '').trim() : "", // Bersihkan sisa tag HTML
                    thumbnail: thumbnail
                };
            });
        } catch (err) {
            console.error("Gagal parse RSS untuk URL: " + url, err.message);
            return [];
        }
    };

    try {
        let rssUrl = "";

        // Mapping 5 endpoint berita resmi langsung ke server pusatnya
        if (type === 'detik') {
            rssUrl = "https://www.detik.com/terpopuler/rss";
        } else if (type === 'cnbc') {
            rssUrl = "https://www.cnbcindonesia.com/news/rss";
        } else if (type === 'kompas') {
            rssUrl = "https://www.kompas.com/trend/rss";
        } else if (type === 'antara') {
            rssUrl = "https://www.antaranews.com/rss/terkini.xml";
        } else if (type === 'suara') {
            rssUrl = "https://www.suara.com/rss/news";
        } else {
            return res.status(404).json({ status: false, creator, message: `Tipe berita '${type}' tidak tersedia!` });
        }

        // Ambil data artikel
        const posts = await parseRSS(rssUrl);

        // Jika gagal mengambil data atau kosong
        if (posts.length === 0) {
            return res.status(404).json({ 
                status: false, 
                creator, 
                message: `Gagal memuat berita terbaru dari ${type}. Silakan coba lagi nanti.` 
            });
        }

        // Kembalikan response sukses mengarah ke array 'posts'
        return res.status(200).json({ 
            status: true, 
            creator, 
            result: posts 
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ 
            status: false, 
            creator, 
            message: "Error internal server saat memproses berita: " + e.message 
        });
    }
}


// ==========================================
// 16. KATEGORI: ENTERTAINMENT
// ==========================================
// ==========================================
// 16. KATEGORI: ENTERTAINMENT
// ==========================================
else if (kategori === 'entertainment') {
    const getRandom = (array) => array[Math.floor(Math.random() * array.length)];
    const creator = "InuuTyzDev";

    const localTypes = [
        'fakta', 'darkjoke', 'pantun', 'gombal', 'kata-lucu', 'kata-sad',
        'pickline', 'tekateki', 'caklontong', 'tebak-jenaka', 'motivasi',
        'asahi', 'susunkata', 'siapakah-aku', 'tebak-kata', 'tebak-lirik',
        'cerpen', 'puisi', 'tebak-gambar', 'tebak-kabupaten', 'tebak-bendera',
        'tebak-kimia'
    ];

    try {
        if (localTypes.includes(type)) {
            const { createRequire } = await import('module');
            const require = createRequire(import.meta.url);
            const entertainmentData = require('../../database/entertainment.json');
            const data = entertainmentData[type];
            if (!data) return res.status(404).json({ status: false, creator, message: `Type '${type}' tidak ditemukan!` });
            return res.status(200).json({ status: true, creator, result: getRandom(data) });

        } else if (type === 'quotes') {
            const resData = await axios.get('https://zenquotes.io/api/random');
            return res.status(200).json({ status: true, creator, result: resData.data[0]?.q || "Tidak ada quotes." });

        } else if (type === 'meme') {
            const resData = await axios.get('https://meme-api.com/gimme');
            return res.status(200).json({ status: true, creator, result: { title: resData.data.title, url: resData.data.url } });

        } else if (type === 'hilih') {
            if (!q) return res.status(400).json({ status: false, creator, message: "Masukkan parameter q!" });
            const result = q.replace(/[aiueo]/gi, 'i');
            return res.status(200).json({ status: true, creator, result });

        } else if (type === 'genshin') {
            const response = await axios.get('https://genshin.jmp.blue/characters/all?lang=en');
            return res.status(200).json({ status: true, creator, result: getRandom(response.data) });

        } else if (type === 'estetik') {
            const list = [
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
            ];
            return res.status(200).json({ status: true, creator, result: getRandom(list) });

        } else {
            return res.status(404).json({ status: false, creator, message: `Type entertainment '${type}' tidak ditemukan!` });
        }

    } catch (e) {
        return res.status(500).json({ status: false, creator, message: "Error saat mengambil data hiburan: " + e.message });
    }
}

        // ==========================================
        // 17. KATEGORI: PRIMBON
        // ==========================================
        else if (kategori === 'primbon') {
            try {
                if (type === 'artinama') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/artinama?name=${encodeURIComponent(q)}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'artimimpi') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (mimpi) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/artimimpi?query=${encodeURIComponent(q)}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'jodoh') {
                    const { nama1, nama2 } = req.query;
                    if (!nama1 || !nama2) return res.status(400).json({ status: false, message: "Parameter 'nama1' & 'nama2' wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/jodoh?name1=${encodeURIComponent(nama1)}&name2=${encodeURIComponent(nama2)}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'watak') {
                    const { tgl, bln, thn } = req.query;
                    if (!tgl || !bln || !thn) return res.status(400).json({ status: false, message: "Parameter 'tgl', 'bln', 'thn' wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/tanggal_lahir?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'nasib') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/ramalan_nasib?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'zodiak') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama zodiak) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/zodiak?query=${q.toLowerCase()}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'shio') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama shio) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/shio?query=${q.toLowerCase()}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'nomorhoki') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nomor HP) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/nomor_hoki?number=${q}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'garistangan') {
                    const list = ["Garis hidupmu kuat, panjang umur.", "Garis cinta bercabang, hati-hati.", "Garis sukses terlihat jelas di usia 30-an."];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: list[Math.floor(Math.random() * list.length)] });

                } else if (type === 'rezeki') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/rejeki_harian?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'haribaik') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/hari_baik?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'harilarangan') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/hari_larangan?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'arahrezeki') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/arah_rejeki?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'pekerjaan') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/pekerjaan_weton?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'usaha') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (tanggal lahir: 14-05-2026) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/sifat_usaha?date=${q}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'pranatamangsa') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/pranata_mangsa?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else {
                    return res.status(404).json({ status: false, message: "Tipe primbon tidak ditemukan!" });
                }
            } catch (e) {
                return res.status(500).json({ status: false, message: "Gagal memproses data Primbon." });
            }
        }

        // ==========================================
        // 18. KATEGORI: IDOL
        // ==========================================
        else if (kategori === 'idol') {
    const creator = "InuuTyzDev";
    const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

    try {
        // 1. Mapping kata kunci pencarian agar hasil di Pinterest lebih akurat
        const queryMap = {
            jkt48: "JKT48 member aesthetic",
            blackpink: "Blackpink aesthetic photo",
            newjeans: "NewJeans kpop hd",
            ive: "IVE kpop member",
            twice: "Twice kpop aesthetic",
            aespa: "Aespa kpop icon",
            lesserafim: "Le Sserafim aesthetic",
            babymonster: "BabyMonster kpop",
            bts: "BTS member portrait",
            exo: "EXO kpop hd"
        };

        const targetSearch = queryMap[type.toLowerCase()] || `${type} kpop`;

        // 🌟 PERBAIKAN 1: Tambahkan &cb=${Date.now()} sebagai Cache Buster agar API Danzy selalu memberikan data baru
        const danzyApiUrl = `https://api.danzy.web.id/api/search/pinterest?q=${encodeURIComponent(targetSearch)}&cb=${Date.now()}`;
        
        const { data } = await axios.get(danzyApiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 10000
        });

        // Pastikan response API valid dan array 'result' tidak kosong
        if (!data || !data.status || !data.result || data.result.length === 0) {
            return res.status(404).json({ 
                status: false, 
                creator, 
                message: `Foto untuk '${type}' tidak ditemukan di database pencarian.` 
            });
        }

        // 3. Ambil 1 objek data secara acak dari array 'result'
        const randomResult = getRandom(data.result);
        const finalImageUrl = randomResult.image;

        // 4. LOGIKA DOWNLOAD DENGAN HEADER PENYAMARAN (ANTI-ERROR 403)
        const imageResponse = await axios.get(finalImageUrl, { 
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                'Referer': 'https://www.pinterest.com/' 
            }
        });

        // 🌟 PERBAIKAN 2: Paksa Browser & Vercel Network untuk TIDAK MENYIMPAN CACHE gambar ini
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
        
        // Set header content-type sesuai tipe gambar asli lalu kirim buffernya
        res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
        return res.status(200).send(imageResponse.data);

    } catch (e) {
        console.error(e);
        return res.status(500).json({ 
            status: false, 
            creator, 
            message: "Gagal memproses atau mengirim gambar: " + e.message 
        });
    }
}



        // ==========================================
        // 19. KATEGORI: ANIME
        // ==========================================
        else if (kategori === 'anime') {
    const creator = "InuuTyzDev";
    const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

    const localAnimeTypes = [
        'waifu', 'neko', 'husbu', 'rem', 'emilia', 'elaina', 
        'miku', 'shinobu', 'megumin', 'bluearchive', 'genshin', 'wallpaper'
    ];

    try {
        // --- 1. PERBAIKAN SCRAPER QUOTES ANIME (OTAKOTAKU) ---
if (type === 'quotes-anime') {
    const creator = "InuuTyzDev";

    try {
        // Source 1: animechan.io — API publik gratis
        let result = null;

        try {
            const { data } = await axios.get('https://animechan.io/api/v1/quotes/random', {
                headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
                timeout: 8000
            });
            if (data?.data) {
                const t = data.data;
                result = {
                    character: t.character?.name || "Tidak diketahui",
                    anime: t.anime?.name || "Tidak diketahui",
                    quote: (t.content || "").trim(),
                    image: "",
                    episode: ""
                };
            }
        } catch {}

        // Source 2: otakotaku scrape langsung per ID random
        if (!result) {
            try {
                const randomId = Math.floor(Math.random() * 900) + 1;
                const { data: html } = await axios.get(`https://otakotaku.com/quote/view/${randomId}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'text/html',
                        'Accept-Language': 'id-ID,id;q=0.9'
                    },
                    timeout: 10000
                });

                const $ = cheerio.load(html);

                // Coba berbagai selector umum
                const quote =
                    $('p.kotoba').text().trim() ||
                    $('[itemprop="description"]').text().trim() ||
                    $('blockquote').first().text().trim() ||
                    $('p.quote').text().trim() ||
                    $('div.quote-text').text().trim();

                const character =
                    $('span.char-name').text().trim() ||
                    $('[itemprop="character"]').text().trim() ||
                    $('a.char').text().trim() ||
                    $('span.character').text().trim();

                const anime =
                    $('span.anime-name').text().trim() ||
                    $('[itemprop="name"]').first().text().trim() ||
                    $('a.anime').text().trim() ||
                    $('span.anime').text().trim();

                const image =
                    $('img.char-img').attr('src') ||
                    $('img.kotoba-img').attr('src') ||
                    $('meta[property="og:image"]').attr('content') || "";

                if (quote && quote.length > 5) {
                    result = {
                        character: character || "Tidak diketahui",
                        anime: anime || "Tidak diketahui",
                        quote: quote.replace(/\n+/g, ' ').trim(),
                        image: image.startsWith('http') ? image : image ? `https://otakotaku.com${image}` : "",
                        episode: "",
                        source_url: `https://otakotaku.com/quote/view/${randomId}`
                    };
                }
            } catch {}
        }

        // Source 3: list hardcode fallback kalau semua gagal
        if (!result) {
            const fallbackQuotes = [
                { quote: "Orang yang tidak bisa menyerah tidak akan pernah mati.", character: "Whitebeard", anime: "One Piece" },
                { quote: "Saya tidak menangis karena lemah, tapi karena sudah lama kuat.", character: "Monkey D. Luffy", anime: "One Piece" },
                { quote: "Jika kamu tidak bisa membagi rasa sakit dengan seseorang, kamu tidak akan bisa menjadi manusia seutuhnya.", character: "Pain", anime: "Naruto" },
                { quote: "Tidak ada yang namanya kebetulan di dunia ini, yang ada hanyalah ketidakhindarannya.", character: "Yuko Ichihara", anime: "xxxHolic" },
                { quote: "Masa lalu adalah sesuatu yang tidak bisa berubah, tapi masa depan adalah sesuatu yang bisa kamu ubah sekarang.", character: "Holo", anime: "Spice and Wolf" },
                { quote: "Kekuatan sejati bukan berasal dari kemenangan. Perjuanganmu membangun kekuatanmu.", character: "Arnold Schwarzenegger", anime: "Gintama" },
                { quote: "Apapun yang terjadi, aku tidak akan pernah menyerah.", character: "Naruto Uzumaki", anime: "Naruto" },
                { quote: "Seorang pria tidak akan menangis kecuali di depan orang yang paling dia cintai.", character: "Renji Abarai", anime: "Bleach" }
            ];
            const pick = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            result = { ...pick, image: "", episode: "" };
        }

        return res.status(200).json({ status: true, creator, result });

    } catch (e) {
        return res.status(500).json({
            status: false, creator,
            message: "Gagal mengambil quotes anime: " + e.message
        });
    }
}




        // --- 2. LOGIKA GAMBAR (DIRECT SEND - FIX ERROR 500) ---
        let imageUrl;
        if (type === 'random-anime') {
            const allKeys = Object.keys(animeData); // animeData dari require di atas
            const randomKey = getRandom(allKeys);
            imageUrl = getRandom(animeData[randomKey]);
        } else if (localAnimeTypes.includes(type)) {
            imageUrl = getRandom(animeData[type]);
        }

        if (imageUrl) {
            const response = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            // Gunakan setHeader agar sama dengan ai-image (anti res.set error)
            res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
            return res.status(200).send(response.data);
        } else {
            return res.status(404).json({ 
                status: false, 
                creator, 
                message: `Type '${type}' tidak terdaftar.` 
            });
        }

    } catch (e) {
        return res.status(500).json({ 
            status: false, 
            creator, 
            message: "Error: " + e.message 
        });
    }
}




        // ==========================================
        // 20. KATEGORI: MOVIE
        // ==========================================
        else if (kategori === 'movie') {
    const keyword = q || query || searchText;
    const baseUrl = "https://api.cuki.biz.id";

    try {
        let response;
        if (type === 'melolo-home') {
            response = await axios.get(`${baseUrl}/api/movie/melolo-home?apikey=${apiKeyCuki}`);
        } else if (type === 'melolo-search') {
            if (!keyword) return res.status(400).json({ status: false, message: "Masukkan query pencarian!" });
            response = await axios.get(`${baseUrl}/api/movie/melolo-search?apikey=${apiKeyCuki}&query=${encodeURIComponent(keyword)}`);
        } else if (type === 'melolo-detail' || type === 'melolo-download') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter URL wajib diisi!" });
            const endpoint = type === 'melolo-detail' ? 'melolo-detail' : 'melolo-download';
            response = await axios.get(`${baseUrl}/api/movie/${endpoint}?apikey=${apiKeyCuki}&url=${encodeURIComponent(url)}`);
        } else if (type === 'donghua-search') {
            response = await axios.get(`${baseUrl}/api/movie/donghua-search?apikey=${apiKeyCuki}&query=${encodeURIComponent(keyword)}&page=${page || 1}`);
        } else if (type === 'netflix-trending') {
            response = await axios.get(`${baseUrl}/api/movie/netflix-trending?apikey=${apiKeyCuki}&language=${language || 'id'}`);
        } else if (type === 'pusatfilm-search') {
            response = await axios.get(`${baseUrl}/api/movie/pusatfilm21-search?apikey=${apiKeyCuki}&query=${encodeURIComponent(keyword)}&type=search`);
        }
        // ... tambahkan else if untuk type movie lainnya sesuai kebutuhan

        if (!response) return res.status(404).json({ status: false, message: "Type movie tidak ditemukan." });

        // --- PROSES CLEANUP CREATOR ---
        let finalResult = response.data.result || response.data;
        if (typeof finalResult === 'object' && finalResult !== null) {
            delete finalResult.creator; // Menghapus creator "cuki digital"
        }

        return res.status(200).json({ 
            status: true, 
            creator: "InuuTyzDev", 
            result: finalResult 
        });

    } catch (e) {
        return res.status(500).json({ status: false, message: "Gagal menyambung ke server movie." });
    }
}



        // ==========================================
        // JIKA KATEGORI TIDAK DIKENAL
        // ==========================================
        else {
            return res.status(404).json({ status: false, message: `Kategori '${kategori}' tidak ditemukan!` });
        }

    } catch (e) {
        // CATCH GLOBAL - Tangkap semua error agar Vercel tidak crash
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Terjadi kesalahan sistem: " + e.message });
    }
}
