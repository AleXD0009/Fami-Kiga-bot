import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

const MAX_MESSAGE_LENGTH = 500

function cleanJidForDisplay(jid) {
  if (!jid || typeof jid !== 'string') return jid;
  let clean = jid.split(':')[0].split('@')[0];
  clean = clean.replace(/[^0-9]/g, '');
  return clean;
}

export default async function(m, conn = { user: {} }) {
  if (!m) return;
  let groupMetadata = null;
  if (m.isGroup && conn?.chats?.[m.chat]?.metadata) {
    groupMetadata = conn.chats[m.chat].metadata;
  }

  let actorJid = m.sender;
  let resolvedActorJid = actorJid;
  if (resolvedActorJid?.endsWith?.('@lid')) {
    try {
      resolvedActorJid = conn.resolveJid?.(resolvedActorJid, groupMetadata) || resolvedActorJid;
    } catch (e) { }
  }

  const _name = m.pushName || m.name || 'Unknown';
  const cleanNumber = cleanJidForDisplay(resolvedActorJid);
  let sender = 'Unknown';

  if (cleanNumber) {
    try {
      sender = PhoneNumber('+' + cleanNumber).getNumber('international') || '+' + cleanNumber;
    } catch (e) {
      sender = '+' + cleanNumber;
    }
  } else if (resolvedActorJid?.includes('@g.us')) {
    sender = 'System (Group)';
  } else {
    sender = resolvedActorJid || 'Unknown';
  }

  let chatName;
  if (m.chat === "status@broadcast") {
    chatName = "Estado de WhatsApp";
  } else {
    chatName = m.chat;
    if (m.chat?.endsWith('@g.us')) {
      const meta = conn.chats?.[m.chat]?.metadata;
      if (meta?.subject) chatName = meta.subject;
    } else if (m.chat?.endsWith('@s.whatsapp.net')) {
      const num = m.chat.replace('@s.whatsapp.net', '');
      try {
        chatName = PhoneNumber('+' + num).getNumber('international') || m.chat;
      } catch (e) {
        chatName = m.chat;
      }
    }
  }

  const date = new Date(1000 * (m.messageTimestamp?.low || m.messageTimestamp || Date.now() / 1000));
  const format = n => n.toString().padStart(2, '0');
  const time = `${format(date.getDate())}/${format(date.getMonth() + 1)}/${date.getFullYear()} - ${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}`;

  const meJid = conn.user?.jid;
  const meRawNumber = meJid ? cleanJidForDisplay(meJid) : null;
  let meNumber = '(Desconocido)';
  if (meRawNumber) {
    try {
      meNumber = PhoneNumber('+' + meRawNumber).getNumber('e164') || '+' + meRawNumber;
    } catch (e) {
      meNumber = '+' + meRawNumber;
    }
  }
  const botName = conn.user?.name || conn.user?.verifiedName || 'Bot';
  const botType = meJid === global.conn?.user?.jid ? 'Principal' : 'Sub Bot';
  const me = meJid ? `${meNumber} - (${botName}) (${botType})` : '(Desconocido)';

  let messageType = 'Unknown';
   if (typeof m.mtype === 'string') {
    messageType = m.mtype.replace(/message$/i, '');
    messageType = messageType.replace('audio', m.msg?.ptt ? 'PttAudioMessage' : 'AudioMessage');
    messageType = messageType.replace(/^./, v => v.toUpperCase());
  };

  console.log(
`${chalk.cyan('ㅤㅤ  ✦ᨘ ㅤㅤ𝑭𝒂𝒎𝒊ㅤㅤ  𓂅ᜒㅤㅤ𝑲𝒊𝒈𝒂ㅤㅤ ✦ᨘ')}
${chalk.cyan('»')} ${chalk.magenta('✦ Socket')} » ${chalk.white(me)}
${chalk.cyan('»')} ${chalk.magenta('✦ Número')} » ${chalk.white(sender)}
${chalk.cyan('»')} ${chalk.magenta('✦ Usuario')} » ${chalk.white(_name !== 'Unknown' ? _name : '-')}
${chalk.cyan('»')} ${chalk.magenta('✦ Fecha')} » ${chalk.white(time)}
${chalk.cyan('»')} ${chalk.magenta('✦ Chat')} » ${chalk.white(chatName)}
${chalk.cyan('»')} ${chalk.magenta('✦ Tipo')} » ${chalk.black(chalk.bgMagenta(' ' + messageType.toUpperCase() + ' '))}
${chalk.cyan('ㅤㅤ𖢌ㅤ ㅤ۬۬ㅤㅤㅤ܀ֺ݄̣۫܀ㅤㅤㅤ۬۬ㅤㅤㅤ𖢌')}`
);

  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '');

    let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~`])(?!`)(.+?)\1|```((?:.|[\n\r])+?)```|`([^`]+?)`)(?=\S?(?:[\s\n]|$))/g;
    let mdFormat = (depth = 4) => (_, type, text, monospace) => {
      let types = { '_': 'italic', '*': 'bold', '~': 'strikethrough', '`': 'bgGray' };
      text = text || monospace;
      let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(/`/g, '').replace(mdRegex, mdFormat(depth - 1)));
      return formatted;
    };

    log = log.replace(mdRegex, mdFormat(4));
    if (log.length > MAX_MESSAGE_LENGTH) {
      log = log.substring(0, MAX_MESSAGE_LENGTH) + '\n' + chalk.blue('Character Limit Exceeded...');
    }

    log = log.split('\n').map(line => {
      if (line.trim().startsWith('>')) return chalk.bgGray.dim(line.replace(/^>/, '┃'));
      if (/^([1-9]|[1-9][0-9])\./.test(line.trim())) {
        return line.replace(/^(\d+)\./, (match, number) => {
          const padding = number.length === 1 ? '  ' : ' ';
          return padding + number + '.';
        });
      }
      if (/^[-*]\s/.test(line.trim())) return line.replace(/^[*-]/, '  •');
      return line;
    }).join('\n');

    if (m.mentionedJid?.length) {
      for (const user of m.mentionedJid) {
        const userString = typeof user === 'string' ? user : (user.phoneNumber || user.id || user.lid || '');
        if (!userString) continue;
        let resolvedJid = userString;
        if (resolvedJid.endsWith('@lid')) {
          try {
            resolvedJid = conn.resolveJid?.(resolvedJid, groupMetadata) || resolvedJid;
          } catch (e) {}
        }
        const username = resolvedJid.split('@')[0];
        const safeTag = '@' + userString.split('@')[0];
        log = log.replace(new RegExp(safeTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), chalk.blueBright('@' + username));
      }
    }

    console.log(log);
  }

  if (/document/i.test(m.mtype)) console.log(`[ARCHIVO] ${m.msg?.fileName || m.msg?.displayName || 'Document'}`);
  else if (/ContactsArray/i.test(m.mtype)) console.log(`[TARJETA]`);
  else if (/contact/i.test(m.mtype)) console.log(`[TARJETA] ${m.msg?.displayName || 'Contacto'}`);
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg?.seconds || 0;
    console.log(`[ARCHIVO] ${m.msg?.ptt ? '🎤ㅤ(PTT ' : '🎵ㅤ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`);
  }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update lib/print.js"))
  import(`${file}?update=${Date.now()}`)
})
