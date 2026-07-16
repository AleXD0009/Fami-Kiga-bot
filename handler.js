import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))
 
export async function handler(chatUpdate) {
this.msgqueque = this.msgqueque || []
if (!chatUpdate) return
this.pushMessage(chatUpdate.messages).catch(console.error)
let m = chatUpdate.messages[chatUpdate.messages.length - 1]
if (!m) return
if (global.db.data == null)
await global.loadDatabase()
try {
m = smsg(this, m) || m
if (!m)
return
m.exp = 0
m.limit = false

if (global.db.data) {
if (m.sender && m.sender !== this.user?.jid && (m.sender.endsWith('@s.whatsapp.net') || m.sender.endsWith('@lid')) && !global.db.data.users[m.sender]) {
global.db.data.users[m.sender] = {
name: m.pushName || m.name,
number: m.sender || m.chat,
registered: false,
regTime: Date.now(),
premiumTime: 0,
premium: false,
age: 0,
bank: 0,
exp: 0,
level: 1,
limit: 100,
afk: 0,
afkReason: '',
useDocument: true,
banned: false
};
}
if (m.isGroup && m.chat.endsWith('@g.us') && !global.db.data.chats[m.chat]) {
global.db.data.chats[m.chat] = {
isBanned: false,
bienvenida: false,
welcome: '',
bye: '',
socket: '',
onlyadmin: false,
onlyLatinos: false,
antiLink: false,
nsfw: false,
primaryBot: null,
economy: true,
gacha: true,
expired: 0
};
}
const socket = this.user?.jid;
var settings = global.db.data.settings[this.user?.jid] || {};

if (socket && !global.db.data.settings[socket]) {
global.db.data.settings[socket] = {
name: this.user?.name || 'hαsumꪱ - bᦅł',
num: this.user?.jid,
}}
}

if (opts['nyimak'])  return
if (!m.fromMe && opts['self'])  return
if (opts['swonly'] && m.chat !== 'status@broadcast')  return 
if (typeof m.text !== 'string') m.text = ''
        
let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
const isOwner = isROwner || m.fromMe
const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user.prem == true

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        
        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {}
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false
        const isBotAdmin = bot?.admin || false

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    console.error(e)
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? 
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
           if (typeof plugin !== 'function')
    continue
let matchedPrefix = (match[0] || '')[0]
let isNoPrefix = !matchedPrefix && plugin.noprefix === true
if ((usedPrefix = matchedPrefix) || isNoPrefix) {
    usedPrefix = usedPrefix || ''
    let noPrefix = matchedPrefix ? m.text.replace(usedPrefix, '') : m.text
    let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
    args = args || []
    let _args = noPrefix.trim().split` `.slice(1)
    let text = _args.join` `
    command = (command || '').toLowerCase()
    let fail = plugin.fail || global.dfail
    let isAccept = plugin.command instanceof RegExp ? 
        plugin.command.test(command) :
        Array.isArray(plugin.command) ?
            plugin.command.some(cmd => cmd instanceof RegExp ? 
                cmd.test(command) :
                cmd === command
            ) :
            typeof plugin.command === 'string' ? 
                plugin.command === command :
                false
                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    let setting = global.db.data.settings[this.user.jid]
                    if (name != 'group-unbanchat.js' && chat?.isBanned)
                        return 
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                    if (name != 'owner-unbanbot.js' && setting?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { 
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { 
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { 
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { 
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { 
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { 
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { 
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { 
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { 
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 
                if (xp > 200)
                    m.reply('chirrido -_-')
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    conn.reply(m.chat, `-`, m, rcanal)
                    continue
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        m.reply(text)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        conn.reply(m.chat, `Utilizaste *${+m.limit}* 🪙`, m, rcanal)
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
      if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }
    const settingsREAD = global.db.data.settings[this.user.jid] || {}
    if (opts['autoread']) await this.readMessages([m.key])
    if (settingsREAD.autoread) await this.readMessages([m.key])
  }
}
global.dfail = async (type, m, conn, usedPrefix) => {
let usrname = m.pushName || m.name || 'Usuario'
let msg = {
    rowner: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝖾𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗌𝗈𝗅𝗈 𝗉𝗎𝖾𝖽𝖾 𝗌𝖾𝗋 𝗎𝗍𝗂𝗅𝗂𝗓𝖺𝖽𝗈 𝗉𝗈𝗋 𝖾𝗅 *𝖢𝗋𝖾𝖺𝖽𝗈𝗋* 𝖽𝖾 𝗅𝖺 𝖡𝗈𝗍.`,
    owner: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝖾𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗌𝗈𝗅𝗈 𝗉𝗎𝖾𝖽𝖾 𝗌𝖾𝗋 𝗎𝗍𝗂𝗅𝗂𝗓𝖺𝖽𝗈 𝗉𝗈𝗋 𝖾𝗅 *𝖢𝗋𝖾𝖺𝖽𝗈𝗋* 𝖽𝖾 𝗅𝖺 𝖡𝗈𝗍 𝗒 *𝖲𝗎𝖻 𝖡𝗈𝗍𝗌*.`,
    mods: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝖾𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗌𝗈𝗅𝗈 𝗉𝗎𝖾𝖽𝖾 𝗌𝖾𝗋 𝗎𝗍𝗂𝗅𝗂𝗓𝖺𝖽𝗈 𝗉𝗈𝗋 𝗅𝗈𝗌 *𝖬𝗈𝖽𝖾𝗋𝖺𝖽𝗈𝗋𝖾𝗌* 𝖽𝖾 𝗅𝖺 𝖡𝗈𝗍.`,
    premium: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝖾𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗌𝗈𝗅𝗈 𝗉𝗎𝖾𝖽𝖾 𝗌𝖾𝗋 𝗎𝗍𝗂𝗅𝗂𝗓𝖺𝖽𝗈 𝗉𝗈𝗋 𝖴𝗌𝗎𝖺𝗋𝗂𝗈𝗌 *𝖯𝗋𝖾𝗆𝗂𝗎𝗆*.`,
    group: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝖾𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗌𝗈𝗅𝗈 𝗉𝗎𝖾𝖽𝖾 𝗌𝖾𝗋 𝗎𝗍𝗂𝗅𝗂𝗓𝖺𝖽𝗈 𝖾𝗇 *𝖦𝗋𝗎𝗉𝗈𝗌*.`,
    private: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝖾𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗌𝗈𝗅𝗈 𝗉𝗎𝖾𝖽𝖾 𝗌𝖾𝗋 𝗎𝗍𝗂𝗅𝗂𝗓𝖺𝖽𝗈 𝖾𝗇 𝗆𝗂 𝖢𝗁𝖺𝗍 *𝖯𝗋𝗂𝗏𝖺𝖽𝗈*.`,
    admin: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝖾𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝗌𝗈𝗅𝗈 𝗉𝗎𝖾𝖽𝖾 𝗌𝖾𝗋 𝗎𝗍𝗂𝗅𝗂𝗓𝖺𝖽𝗈 𝗉𝗈𝗋 𝗅𝗈𝗌 *𝖠𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝖽𝗈𝗋𝖾𝗌* 𝖽𝖾𝗅 𝖦𝗋𝗎𝗉𝗈.`,
    botAdmin: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗅𝖺 𝖻𝗈𝗍 𝖽𝖾𝖻𝖾 𝗌𝖾𝗋 *𝖠𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝖽𝗈𝗋𝖺* 𝗉𝖺𝗋𝖺 𝖾𝗃𝖾𝖼𝗎𝗍𝖺𝗋 𝖾𝗌𝗍𝖾 𝖢𝗈𝗆𝖺𝗇𝖽𝗈.`,
    unreg: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝗉𝖺𝗋𝖺 𝗎𝗌𝖺𝗋 𝖾𝗌𝗍𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 𝖽𝖾𝖻𝖾𝗌 𝖾𝗌𝗍𝖺𝗋 *𝖱𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝖽𝗈.*\n\n𝖯𝖺𝗋𝖺 𝗎𝗌𝖺𝗋 𝖾𝗅 𝖻𝗈𝗍 𝖽𝖾𝖻𝖾𝗌 𝗋𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝗋𝗍𝖾 𝗉𝗋𝗂𝗆𝖾𝗋𝗈\n\n𝖴𝗍𝗂𝗅𝗂𝗓𝖺: */reg nombre.edad*\n\n_𝖤𝗃𝖾𝗆𝗉𝗅𝗈: */reg JTxs⁩.666*_\n\n𝖭𝗈 𝗉𝗈𝗇𝗀𝖺𝗌 𝗅𝗈𝗌 * *`,
    restrict: `❀ 𝖧𝗈𝗅𝖺 *${usrname}*, 𝖾𝗌𝗍𝖺 𝖼𝖺𝗋𝖺𝖼𝗍𝖾𝗋í𝗌𝗍𝗂𝖼𝖺 𝖾𝗌𝗍á *𝖽𝖾𝗌𝗁𝖺𝖻𝗂𝗅𝗂𝗍𝖺𝖽𝖺.*`
}[type]
if (!msg) return
try {
let urlA = global.canal
let imageUrl = 'https://i.pinimg.com/736x/18/60/49/1860493e9384edbcc6e1ffe202f24b01.jpg'
let res = await fetch(imageUrl)
let arrayBuffer = await res.arrayBuffer()
let thumbBuffer = Buffer.from(arrayBuffer)

await conn.sendMessage(m.chat, { text: `${urlA} ${msg}`, linkPreview: { 'matched-text': urlA, title: global.botname, description: 'Inf', previewType: 0, jpegThumbnail: thumbBuffer } }, { quoted: m })
return m.react('✖️')
} catch (e) {
console.error(e)
return conn.reply(m.chat, msg, m, rcanal).then(_ => m.react('✖️'))
}}

/*}[type]
if (msg) return conn.reply(m.chat, msg, m, rcanal).then(_ => m.react('✖️'))
}*/

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("Se actualizo 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
