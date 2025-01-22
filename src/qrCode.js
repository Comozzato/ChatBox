import pkg from "whatsapp-web.js";
import { fileURLToPath } from "url";
import path from "path";
import qrCode from "qrcode"; // Importação correta do pacote qrcode
import qrCodeTerminal from "qrcode-terminal";
const { Client, LocalAuth } = pkg;

export function initializeWhatsApp(io) {
  const client = new Client({
    authStrategy: new LocalAuth(), // ou qualquer outro método de autenticação
  });

  // Quando o QR Code for gerado
  client.on("qr", (qr) => {
    try {
      console.log(
        "QR Code recebido. Salvando como imagem e enviando ao frontend."
      );

      // Definir caminho absoluto para o QR Code

      const publicDir = path.join(__dirname, "../public");
      const qrPath = path.join(publicDir, "qr.png");

      // Salvar o QR Code como uma imagem (qr.png)
      qrCode.toFile(qrPath, qr, (err) => {
        if (err) {
          console.error("Erro ao salvar QR Code como imagem:", err);
          return;
        }
        console.log("QR Code salvo como imagem em:", qrPath);
        io.emit("qr", "/qr.png"); // Envia o caminho da imagem para o frontend
      });

      // Exibir o QR Code no terminal para debug
      qrCodeTerminal.generate(qr, { small: true });
    } catch (err) {
      console.error("Erro ao processar QR Code:", err);
    }
  });

  // Inicializa o cliente WhatsApp
  client.initialize();

  return client;
}
