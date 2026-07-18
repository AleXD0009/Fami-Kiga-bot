import fetch from 'node-fetch'

let FM = async (m, { conn, args }) => {
let usrname = conn.getName ? conn.getName(m.sender) : m.pushName || 'Usuario'
if (!args[0]) return conn.reply(m.chat, `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗂𝗇𝗀𝗋𝖾𝗌𝖺 𝗎𝗇 𝖾𝗇𝗅𝖺𝖼𝖾 𝖽𝖾 *𝖸𝗈𝗎𝖳𝗎𝖻𝖾* 𝗏á𝗅𝗂𝖽𝗈.`, m, rcanal)

try {
let res = await fetch(`${global.apist}/api/download/ytmp4?url=${encodeURIComponent(args[0])}`)
let json = await res.json()
let { title, dl_url, thumbnail, url } = json.data
let txt = `ㅤㅤ✿ུ    *( 𝗒𝗍𝗆𝗉4 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 )*
ㅤㅤꕥ  *𝖳í𝗍𝗎𝗅𝗈* : ${title}
ㅤㅤ✤  *𝖢𝖺𝗅𝗂𝖽𝖺𝖽* : 360p
ㅤㅤ✤  *𝖤𝗇𝗅𝖺𝖼𝖾* : ${url}

ㅤㅤ᎒᎒᎒ㅤㅤㅤ̓ㅤㅤ✿ㅤㅤ̓ㅤㅤㅤ᎒᎒᎒`
await conn.sendMessage(m.chat, { image: { url: thumbnail  }, caption: txt, footer: global.botname, optionText: '᎒᎒᎒ Links Oficiales', optionTitle: '᎒᎒᎒ Links Oficiales', nativeFlow: [ { text: '✿ Canal', url: global.canal, useWebview: true }, { text: '✿ Api', url: global.apist, useWebview: true }, { text: '✿ Github', url: 'https://github.com/AleXD0009/Fami-Kiga-bot', useWebview: true } ] }, { quoted: m })
await conn.sendMessage(m.chat, { video: { url: dl_url }, mimetype: 'video/mp4', fileName: `${title}.mp4`, }, { quoted: m })

} catch (error) {
console.log(error)
await m.react('❌')
}}

FM.help = ['ytmp4 ( Link )']
FM.tags = ['dl']
FM.command = ['ytmp4', 'ytv', 'ytvideo']

export default FM
