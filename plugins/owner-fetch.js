import fetch from 'node-fetch'
import { format } from 'util'

let FM = async (m, { text, conn }) => {
let usrname = conn.getName ? conn.getName(m.sender) : m.pushName || 'Usuario'
if (!/^https?:\/\//.test(text)) return conn.reply(m.chat, `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗂𝗇𝗀𝗋𝖾𝗌𝖺 𝗎𝗇 𝖾𝗇𝗅𝖺𝖼𝖾 *𝗏á𝗅𝗂𝖽𝗈.*`, m, rcanal)
let _url = new URL(text)
let url = global.API(_url.origin, _url.pathname, Object.fromEntries(_url.searchParams.entries()), 'APIKEY')
let res = await fetch(url)
if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
return m.reply(`Content-Length: ${res.headers.get('content-length')}`)
}
if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, url, 'file', text, m)
let txt = await res.buffer()
try {
txt = format(JSON.parse(txt + ''))
} catch (e) {
txt = txt + ''
} finally {
m.reply(txt.slice(0, 65536) + '')
}}

FM.help = ['fetch'].map(v => v + ' ( Link )')
FM.tags = ['owner']
FM.command = ['fetch', 'get']
FM.rowner = true 

export default FM

global.APIs = {}
global.APIKeys = {}
    
global.API = (name, path = "/", query = {}, apikeyqueryname) =>
(name in global.APIs ? global.APIs[name] : name) +
path +
(query || apikeyqueryname
? "?" +
new URLSearchParams(
Object.entries({
...query,
...(apikeyqueryname
? {
[apikeyqueryname]:
global.APIKeys[
name in global.APIs ? global.APIs[name] : name
],
}
: {}),
}),
)
: "")
