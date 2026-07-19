import fetch from 'node-fetch'

let FM = async (m, { conn, args }) => {
let usrname = conn.getName ? conn.getName(m.sender) : m.pushName || 'Usuario'
if (!args[0]) return conn.reply(m.chat, `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗂𝗇𝗀𝗋𝖾𝗌𝖺 𝗎𝗇 𝖾𝗇𝗅𝖺𝖼𝖾 𝖽𝖾 *𝖨𝗇𝗌𝗍𝖺𝗀𝗋𝖺𝗆* 𝗏á𝗅𝗂𝖽𝗈.`, m, rcanal)

try {
let res = await fetch(`${global.apist}/api/download/instagram?url=${encodeURIComponent(args[0])}`)
let json = await res.json()
let { result } = json.data
if (result.length === 1) {
let item = result[0]
let buffer = await fetch(item.dl_url).then(r => r.buffer())
if (item.type.toLowerCase() === 'video') {
await conn.sendMessage(m.chat, { video: buffer, mimetype: 'video/mp4', fileName: 'igdl.mp4', caption: null }, { quoted: m })
} else {
await conn.sendMessage(m.chat, { image: buffer, caption: null }, { quoted: m })
}} else {
let album = []
for (let i = 0; i < result.length; i++) {
let item = result[i]
let buffer = await fetch(item.dl_url).then(r => r.buffer())
if (item.type.toLowerCase() === 'video') {
album.push({ video: buffer, caption: i === 0 ? `` : '', })
} else {
album.push({ image: buffer, caption: i === 0 ? `` : '', })
}}
await conn.sendMessage(m.chat, { album }, { quoted: m })
}

} catch (error) {
console.log(error)
await m.react('❌')
}}

FM.help = ['instagram ( Link )']
FM.tags = ['dl']
FM.command = ['instagramdl', 'instagram', 'igdl', 'ig']

export default FM
