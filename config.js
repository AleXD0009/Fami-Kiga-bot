import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [ ['', '-', true] ]

global.mods = []
global.prems = []
   
global.botname = '𝖿𝖺𝗆𝗂 𝗄𝗂𝗀𝖺 - bot'
global.id_canal = '120363274577422945@newsletter'
global.canal = 'https://whatsapp.com/channel/0029VbD0tcmAe5VxeQfZeE0j'
global.canalh = 'https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n'
global.apist = 'https://api.starlights.uk'


const canales = [
{ id: '120363274577422945@newsletter', nombre: '🜸 hαsumꪱ - bᦅł - Chα𝗇𝗇𝖾𝗅 ✿' },
{ id: '120363428666418397@newsletter', nombre: 'ㅤ𐴝𐴐𐴝ㅤ✦ᨘㅤ𝖿𝖺𝗆𝗂 𝗄𝗂𝗀𝖺 - 𝖼𝗁𝖺𝗇𝗇𝖾𝗅 ㅤ✦ᨘㅤ𐴝𐴐𐴝' }
]

const canalSeleccionado = canales[Math.floor(Math.random() * canales.length)]
global.rcanal = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: canalSeleccionado.id, newsletterName: canalSeleccionado.nombre, }}}

global.multiplier = 69 
global.maxwarn = '2'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
