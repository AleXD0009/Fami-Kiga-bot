import fetch from 'node-fetch'

let FM = async (m, { conn, args }) => {
let usrname = conn.getName ? conn.getName(m.sender) : m.pushName || 'Usuario'
if (!args[0]) return conn.reply(m.chat, `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗂𝗇𝗀𝗋𝖾𝗌𝖺 𝗎𝗇 *𝗎𝗌𝖾𝗋𝗇𝖺𝗆𝖾* 𝖽𝖾 𝖳𝗂𝗄𝖳𝗈𝗄 𝗏á𝗅𝗂𝖽𝗈.`, m, rcanal)

try {
let username = args[0].replace('@', '')
let res = await fetch(`${global.apist}/api/tools/tiktokstalkv2?username=${encodeURIComponent(username)}`)
let json = await res.json()
let { user, about, status, avatar, stats } = json.data

    let txt = `ㅤ𐴒𐴑𐴏ㅤ✿ུㅤ( 𝗍𝗂𝗄𝗍𝗈𝗄 𝗌𝗍𝖺𝗅𝗄 )
ㅤㅤ ꕥ  *𝖭𝗈𝗆𝖻𝗋𝖾* : ${user?.nickname || 'Sin nombre'}
ㅤㅤ ꕥ  *𝖴𝗌𝖾𝗋𝗇𝖺𝗆𝖾* : @${user?.username || 'Desconocido'}
ㅤㅤ ✤  *𝖨𝖣* : ${user?.id || 'N/A'}
ㅤㅤ ✤  *𝖴𝖱𝖫* : ${user?.url || 'N/A'}

ㅤㅤ᎒᎒᎒ㅤㅤㅤ̓ㅤㅤ✿ㅤㅤ̓ㅤㅤㅤ᎒᎒᎒

ㅤㅤ ꕥ  *𝖡𝗂𝗈* : ${about?.bio || 'Sin biografía'}
ㅤㅤ ꕥ  *𝖨𝖽𝗂𝗈𝗆𝖺* : ${about?.language || 'N/A'}
ㅤㅤ ✤  *𝖢𝗎𝖾𝗇𝗍𝖺 𝖼𝗋𝖾𝖺𝖽𝖺* : ${about?.createdAt || 'N/A'}

ㅤㅤ᎒᎒᎒ㅤㅤㅤ̓ㅤㅤ✿ㅤㅤ̓ㅤㅤㅤ᎒᎒᎒

ㅤㅤ ꕥ  *𝖵𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝖽𝗈* : ${status?.verified ? 'Sí' : 'No'}
ㅤㅤ ꕥ  *𝖯𝗋𝗂𝗏𝖺𝖽𝗈* : ${status?.private ? 'Sí' : 'No'}
ㅤㅤ ✤  *𝖵𝖾𝗇𝖽𝖾𝖽𝗈𝗋* : ${status?.seller ? 'Sí' : 'No'}

ㅤㅤ᎒᎒᎒ㅤㅤㅤ̓ㅤㅤ✿ㅤㅤ̓ㅤㅤㅤ᎒᎒᎒

ㅤㅤ ꕥ  *𝖲𝖾𝗀𝗎𝗂𝖽𝗈𝗋𝖾𝗌* : ${stats?.followers?.toLocaleString() || '0'}
ㅤㅤ ꕥ  *𝖲𝗂𝗀𝗎𝗂𝖾𝗇𝖽𝗈* : ${stats?.following?.toLocaleString() || '0'}
ㅤㅤ ✤  *𝖠𝗆𝗂𝗀𝗈𝗌* : ${stats?.friends?.toLocaleString() || '0'}
ㅤㅤ ✤  *𝖫𝗂𝗄𝖾𝗌* : ${stats?.likes?.toLocaleString() || '0'}
ㅤㅤ ✤  *𝖵í𝖽𝖾𝗈𝗌* : ${stats?.videos?.toLocaleString() || '0'}

ㅤㅤ᎒᎒᎒ㅤㅤㅤ̓ㅤㅤ✿ㅤㅤ̓ㅤㅤㅤ᎒᎒᎒`

let img = avatar.large || avatar.medium || avatar.thumb
if (img) {
await conn.sendMessage(m.chat, { image: { url: img  }, caption: txt, footer: global.botname, optionText: '᎒᎒᎒ Links Oficiales', optionTitle: '᎒᎒᎒ Links Oficiales', nativeFlow: [ { text: '✿ Canal', url: global.canal, useWebview: true }, { text: '✿ Api', url: global.apist, useWebview: true }, { text: '✿ Github', url: 'https://github.com/AleXD0009/Fami-Kiga-bot', useWebview: true } ] }, { quoted: m })
} else {
await conn.reply(m.chat, txt, m, rcanal)
}

} catch (error) {
console.log(error)
await m.react('❌')
}}

FM.help = ['tiktokstalk ( username )']
FM.tags = ['tools']
FM.command = ['tiktokstalk', 'ttstalk', 'stalktiktok']

export default FM
