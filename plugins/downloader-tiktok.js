import fetch from 'node-fetch'

let FM = async (m, { conn, args }) => {
let usrname = conn.getName ? conn.getName(m.sender) : m.pushName || 'Usuario'
if (!args[0]) return conn.reply(m.chat, `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗂𝗇𝗀𝗋𝖾𝗌𝖺 𝗎𝗇 𝖾𝗇𝗅𝖺𝖼𝖾 𝖽𝖾 *𝖳𝗂𝗄𝖳𝗈𝗄* 𝗏á𝗅𝗂𝖽𝗈.`, m, rcanal)

try {
let res = await fetch(`${global.apist}/api/download/tiktok?url=${encodeURIComponent(args[0])}`)
let json = await res.json()
let { title, author, stats, type, download, slides, music, cover } = json.data
let txt = `ㅤ𐴒𐴑𐴏ㅤ✿ུㅤ( 𝗍𝗂𝗄𝗍𝗈𝗄 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 )

ㅤㅤ ꕥ  *𝖳í𝗍𝗎𝗅𝗈* : ${title || 'Sin título'}
ㅤㅤ ꕥ  *𝖠𝗎𝗍𝗈𝗋* : ${author?.nickname || 'Desconocido'}
ㅤㅤ ✤  *𝖵𝗂𝗌𝗍𝖺𝗌* : ${stats?.views || '0'}
ㅤㅤ ✤  *𝖫𝗂𝗄𝖾𝗌* : ${stats?.likes || '0'}
ㅤㅤ ✤  *𝖢𝗈𝗆𝖾𝗇𝗍𝖺𝗋𝗂𝗈𝗌* : ${stats?.comments || '0'}
ㅤㅤ ✤  *𝖢𝗈𝗆𝗉𝖺𝗋𝗍𝗂𝖽𝗈𝗌* : ${stats?.shares || '0'}

ㅤㅤ᎒᎒᎒ㅤㅤㅤ̓ㅤㅤ✿ㅤㅤ̓ㅤㅤㅤ᎒᎒᎒`

await conn.sendMessage(m.chat, { image: { url: cover  }, caption: txt, footer: global.botname, optionText: '᎒᎒᎒ Links Oficiales', optionTitle: '᎒᎒᎒ Links Oficiales', nativeFlow: [ { text: '✿ Canal', url: global.canal, useWebview: true }, { text: '✿ Api', url: global.apist, useWebview: true }, { text: '✿ Github', url: 'https://github.com/AleXD0009/Fami-Kiga-bot', useWebview: true } ] }, { quoted: m })
if (type === 'video') {
let videoUrl = download?.no_watermark_hd || download?.no_watermark
await conn.sendMessage(m.chat, { video: { url: videoUrl }, mimetype: 'video/mp4', fileName: `${title || 'tiktok'}.mp4` }, { quoted: m })
} else if (type === 'image') {
let images = Object.keys(slides || {}).filter(key => !isNaN(key)).map(key => slides[key].url).filter(Boolean)
if (images.length === 1) {
await conn.sendMessage(m.chat, { image: { url: images[0] }, mentions: [m.sender] }, { quoted: m })
} else {
let album = images.map(url => ({ image: { url } }))
await conn.sendMessage(m.chat, { album }, { quoted: m })
}
} else {
await m.react('❌')
return conn.reply(m.chat, `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗍𝗂𝗉𝗈 𝖽𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗂𝖽𝗈 𝗇𝗈 𝗌𝗈𝗉𝗈𝗋𝗍𝖺𝖽𝗈.`, m, rcanal)
}
if (music) {
await conn.sendMessage(m.chat,{ audio: { url: music }, mimetype: 'audio/mpeg', fileName: `tt.mp3` }, { quoted: m })
}

} catch (error) {
console.log(error)
await m.react('❌')
} }

FM.help = ['tiktok ( Link )']
FM.tags = ['dl']
FM.command = ['tiktok', 'tt', 'tiktokdl', 'ttdl']

export default FM
