// messages.js

import {inBusinessHours} from './Functions/inBusinessHours.js'
export async function handleMessages(client) {
  // Quando o WhatsApp Web estiver pronto para ser usado
  client.on("ready", () => {
    console.log("WhatsApp Web está pronto!");
  });
  const hours = inBusinessHours();
  // Receber mensagens
  client.on("message", (message) => {
    console.log(hours, 'textes')
    if (!hours) {
      // Mensagem fora do horário de expediente
      message.reply(`Olá,\n\nInfelizmente o atendimento de hoje já encerrou. Estamos fora da loja neste momento e não poderemos responder imediatamente. Caso queira deixar sua dúvida, lhe retornaremos assim que possível. \n\n🕐Horário de expediente de segunda a sexta das 9h até as 19h, e aos sábados das 9h até as 17h.\n\nTenha uma ótima noite🌙!\n\nAtenciosamente`
      );
      return;
    }
  });
}
