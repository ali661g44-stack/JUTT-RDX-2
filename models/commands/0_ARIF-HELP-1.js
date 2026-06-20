module.exports.config = {
  name: "help",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "THIS BOT IS MR ARIF BABU",
  usePrefix: true,
  commandCategory: "BOT-COMMAND-LIST",
  usages: "[page | command name]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 0
  }
};

module.exports.languages = {
  en: {
    moduleInfo:
`「 %1 」
%2

❯ Usage: %3
❯ Category: %4
❯ Cooldown: %5 second(s)
❯ Permission: %6

» Module by %7 «`,
    helpList: "[ There are %1 commands | Use %2help <command> ]",
    user: "User",
    adminGroup: "Admin group",
    adminBot: "Admin bot"
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  // 🔹 SINGLE COMMAND HELP
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const command = commands.get(args[0].toLowerCase());

    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${command.config.usages || ""}`,
        command.config.commandCategory,
        command.config.cooldowns,
        command.config.hasPermssion == 0
          ? getText("user")
          : command.config.hasPermssion == 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      ),
      threadID,
      messageID
    );
  }

  // 🔹 HELP LIST
  const page = parseInt(args[0]) || 1;
  const numberOfOnePage = 8;
  const arrayInfo = [];

  for (const [name] of commands) arrayInfo.push(name);
  arrayInfo.sort();

  const start = (page - 1) * numberOfOnePage;
  const end = start + numberOfOnePage;
  const pageCommands = arrayInfo.slice(start, end);

  let msg =
`╭──────── ★ ·. · ────────╮
📜 𝗛𝗘𝗟𝗣 𝗣𝗔𝗚𝗘
╰──────── · · ★ ────────╯

┏━━━━━━━━━━━━━━━┓
`;

  let index = start;
  for (const name of pageCommands) {
    msg += `𒁍 [${++index}] → ${prefix}${name}\n`;
  }

  msg +=
`
┗━━━━━━━━━━━━━━━┛

PAGE [${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)}]
COMMAND DETAIL: ${prefix}help <command>

🤖 THIS BOT IS MADE BY AYAN JUTT 🙂
`;

  return api.sendMessage(msg, threadID, messageID);
};
