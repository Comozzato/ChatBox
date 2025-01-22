// leitor de qr code
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Butto
// ns
const client = new Client({
    authStrategy: new LocalAuth() // Salva a sessão localmente em .wwebjs_auth
});

// Evento disparado para gerar o QR Code (apenas na primeira execução ou se a sessão expirar)
client.on('qr', qr => {
    console.log('Escaneie o QR Code abaixo para conectar:');
    qrcode.generate(qr, { small: true }); // Gera um QR Code no terminal
});

// Evento disparado quando o cliente estiver pronto (sessão carregada ou criada com sucesso)
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Evento disparado para logs de debug (opcional)
client.on('authenticated', () => {
    console.log('Sessão autenticada com sucesso.');
});

client.on('auth_failure', msg => {
    console.error('Falha na autenticação', msg);
});

client.on('disconnected', reason => {
    console.log('Cliente desconectado:', reason);
    // Aqui você pode implementar uma lógica para reiniciar o bot ou lidar com desconexões
    client.initialize();
});

client.initialize();
const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra
// Funil
const moment = require('moment-timezone');

client.on('message', async msg => {
    const now = moment().tz('America/Manaus'); // Data e hora no fuso horário de Manaus
    const currentHour = now.hour(); // Hora atual (24h)
    const currentDay = now.day();  // Dia da semana (0 = Domingo, 6 = Sábado)
    // Horário de expediente: Segunda a Sexta (9h-19h), Sábado (9h-17h)
    const isWeekday = currentDay >= 1 && currentDay <= 5; // Segunda a Sexta
    const isSaturday = currentDay === 6; // Sábado
    const isSunday = currentDay === 0; // Domingo 
    const inBusinessHours = (isWeekday && currentHour >= 9 && currentHour < 10) || 
                            (isSaturday && currentHour >= 9 && currentHour < 17);
    console.log(currentHour);
    if (!inBusinessHours) {
        // Mensagem fora do horário de expediente
        await client.sendMessage(msg.from, 
            `Olá,\n\nInfelizmente o atendimento de hoje já encerrou. Estamos fora da loja neste momento e não poderemos responder imediatamente. Caso queira deixar sua dúvida, lhe retornaremos assim que possível. \n\n🕐Horário de expediente de segunda a sexta das 9h até as 19h, e aos sábados das 9h até as 17h.\n\nTenha uma ótima noite🌙!\n\nAtenciosamente`);
        return;
    }

});