import fetch from 'node-fetch'

let FM = async (m, { conn, args }) => {
let usrname = conn.getName ? conn.getName(m.sender) : m.pushName || 'Usuario'
if (!args[0]) return conn.reply(m.chat, `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗂𝗇𝗀𝗋𝖾𝗌𝖺 𝗎𝗇 𝖾𝗇𝗅𝖺𝖼𝖾 𝖽𝖾 *𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄* 𝗏á𝗅𝗂𝖽𝗈.`, m, rcanal)

try {
let res = await fetch(`${global.apist}/api/download/facebook?url=${encodeURIComponent(args[0])}`)
let json = await res.json()
if (!json.status || !json.data) {
await m.react('❌')
}
let { title, hd, sd } = json.data
let videoUrl = hd || sd

if (!videoUrl) {
await m.react('❌')
}
let dl_url = await fetch(hd || sd).then(r => r.buffer())
await conn.sendMessage(m.chat, { video: dl_url, mimetype: 'video/mp4', fileName: 'video.mp4', caption: null }, { quoted: m })
} catch (error) {
console.log(error)
await m.react('❌')
}}

FM.help = ['facebook ( Link )']
FM.tags = ['dl']
FM.command = ['fb', 'facebook', 'fbdl']

export default FM
