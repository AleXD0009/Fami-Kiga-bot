import fetch from 'node-fetch'

let FM = async (m, { conn, args, text }) => {
let usrname = conn.getName ? conn.getName(m.sender) : m.pushName || 'Usuario'
if (!text) return conn.reply(m.chat, `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗂𝗇𝗀𝗋𝖾𝗌𝖺 𝗎𝗇𝖺 𝖻ú𝗌𝗊𝗎𝖾𝖽𝖺 𝗉𝖺𝗋𝖺 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍.`, m, rcanal)

try {
let res = await fetch(`${global.apist}/api/search/pinterest?q=${encodeURIComponent(text)}`)
let json = await res.json()
let shuffled = [...json.result].sort(() => Math.random() - 0.5)
let selected = shuffled.slice(0, 5)

let album = selected.map((item, i) => {
let txt = `ㅤ𐴒𐴑𐴏ㅤ✿ུㅤ*( 𝗉𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝗌𝖾𝖺𝗋𝖼𝗁 )*
ㅤㅤ ꕥ  *𝖡ú𝗌𝗊𝗎𝖾𝖽𝖺* : ${text}
ㅤㅤ ꕥ  *𝖱𝖾𝗌𝗎𝗅𝗍𝖺𝖽𝗈* : ${i + 1}/${selected.length}

ㅤㅤ᎒᎒᎒ㅤㅤㅤ̓ㅤㅤ✿ㅤㅤ̓ㅤㅤㅤ᎒᎒᎒

ㅤㅤ ✤  *𝖳í𝗍𝗎𝗅𝗈* : ${item.title?.slice(0, 60) || 'Sin título'}${item.title?.length > 60 ? '...' : ''}
ㅤㅤ    ✿ *𝖴𝗌𝗎𝖺𝗋𝗂𝗈* : @${item.username || 'Desconocido'}
ㅤㅤ    ✿ *𝖥𝗎𝖾𝗇𝗍𝖾* : ${item.source}`
return { image: { url: item.image }, caption: txt, } })
await conn.sendMessage(m.chat, { album }, { quoted: m })
} catch (error) {
console.log(error)
await m.react('❌')
}}

FM.help = ['pinterest ( Texto )']
FM.tags = ['search']
FM.command = ['pinterest', 'pin', 'pinsearch']

export default FM
