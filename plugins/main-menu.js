import { xpRange } from '../lib/levelling.js'

let tags = {
  'main': '𝗂𝗇𝖿𝗈 - 𝖻𝗈𝗍',
  'search': '𝗌𝖾𝖺𝗋𝖼𝗁',
  'dl': '𝖽𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗌',
  'tools': '𝗍𝗈𝗈𝗅𝗌',
  'sticker': '𝗌𝗍𝗂𝖼𝗄𝖾𝗋𝗌',
  'owner': '𝖼𝗋𝖾𝖺𝖽𝗈𝗋',
}

const defaultMenu = {
before: `𐴝𐴐𐴝ㅤ݄ㅤ𝖿𝖺𝗆𝗂 𝗄𝗂𝗀𝖺 - 𝖻𝗈𝗍ㅤㅤ݄ㅤ𐴝𐴐𐴝

ㅤㅤ ✿  *M𝗈𝖽𝗈* : Público
ㅤㅤ ✿  *B𝖺𝗂𝗅𝖾𝗒𝗌* : Multi Device
ㅤㅤ ✥  *T𝗂𝖾𝗆𝗉𝗈 𝖺𝖼𝗍𝗂𝗏𝗈* : %uptime
ㅤㅤ ✥  *U𝗌𝗎𝖺𝗋𝗂𝗈𝗌* : %totalreg

ㅤㅤ𖢌ㅤㅤ۬۬ㅤㅤㅤ܀ֺ݄̣۫܀ㅤㅤㅤ۬۬ㅤㅤㅤ𖢌
%readmore 
ㅤ𐴒𐴑𐴏ㅤ✿ུㅤ( 𝗂𝗇𝖿𝗈 𝗎𝗌𝖾𝗋 )
ㅤㅤ ꕥ  *N𝗈𝗆𝖻𝗋𝖾* : %name
ㅤㅤ ꕥ  *C𝗈𝗂𝗇𝗌* : %limit
ㅤㅤ ✤  *N𝗂𝗏𝖾𝗅* : %level
ㅤㅤ ✤  *X𝗉* : %totalexp

ㅤㅤ⟮ㅤ♥︎ᨘׄ♥︎ᨘׄㅤ⟯ㅤㅤㅤㅤ᎒᎒᎒ㅤㅤㅤ✥
%readmore`,
  header: 'ㅤ𐴒𐴑𐴏ㅤ✿ུㅤ（ %category ）',
  body: 'ㅤㅤᨗ✤ㅤ%cmd %islimit %isPremium\n',
  footer: 'ㅤㅤ᎒᎒᎒ㅤㅤㅤ̓ㅤㅤ✿ㅤㅤ̓ㅤㅤㅤ᎒᎒᎒\n',
  after: `ㅤㅤㅤㅤ۬۬ㅤㅤㅤㅤ𐎟ㅤְׁ۬ㅤ𐎟ㅤㅤㅤㅤ۬۬`,
}

let FM = async (m, { conn, usedPrefix: _p, __dirname }) => {
try {
let { exp, limit, level } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await m.pushName
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)
let d = new Date(new Date + 3600000)
let locale = 'es'
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
return { help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help], tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
prefix: 'customPrefix' in plugin, limit: plugin.limit, premium: plugin.premium, enabled: !plugin.disabled, }})
for (let plugin of help)
if (plugin && 'tags' in plugin)
for (let tag of plugin.tags)
if (!(tag in tags) && tag) tags[tag] = tag
conn.menu = conn.menu ? conn.menu : {}
let before = conn.menu.before || defaultMenu.before
let header = conn.menu.header || defaultMenu.header
let body = conn.menu.body || defaultMenu.body
let footer = conn.menu.footer || defaultMenu.footer
let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : ``) + defaultMenu.after
let _text = [before, ...Object.keys(tags).map(tag => { return header.replace(/%category/g, tags[tag]) + '\n' + [...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => { return menu.help.map(help => { return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).replace(/%islimit/g, menu.limit ? '( ✿ )' : '').replace(/%isPremium/g, menu.premium ? '( ꕥ )' : '').trim() }).join('\n') }), footer ].join('\n') }), after ].join('\n')
let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
let replace = { '%': '%', p: _p, uptime, _uptime, taguser: '@' + m.sender.split("@s.whatsapp.net")[0], me: conn.getName(conn.user.jid), level, limit, name,
week, date, time, totalreg, rtotalreg, totalexp: `${xp}/${max}`, readmore: readMore }
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

await conn.sendMessage(m.chat, { image: { url: 'https://i.pinimg.com/1200x/08/41/e7/0841e734f76287b6f5b7cf1bc0da8169.jpg' }, caption: text, footer: global.botname, optionText: '᎒᎒᎒ Links Oficiales', optionTitle: '᎒᎒᎒ Links Oficiales', nativeFlow: [ { text: '✿ Canal', url: global.canal, useWebview: true }, { text: '✿ Api', url: global.apist, useWebview: true }, { text: '✿ Github', url: 'https://github.com/AleXD0009/Fami-Kiga-bot', useWebview: true } ] }, { quoted: m })

} catch (error) {
console.log(error)
}}

FM.help = ['menu']
FM.tags = ['main']
FM.command = ['menu', 'help', 'menú'] 

export default FM


const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
const h = Math.floor(ms / 3600000);
const m = Math.floor(ms / 60000) % 60;
const s = Math.floor(ms / 1000) % 60;
//  console.log({ ms, h, m, s });
return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
