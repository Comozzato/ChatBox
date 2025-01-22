import fs from "fs";
import pkg from "whatsapp-web.js";
import { fileURLToPath } from "url";
import path from "path";
import qrCode from "qrcode"; // Importação correta do pacote qrcode
import qrCodeTerminal from "qrcode-terminal";
import { exec } from "child_process";

const { Client, LocalAuth } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userId = '12456'
export function initializeWhatsApp(io) {
  const authStrategy = new LocalAuth({
    clientId: userId, 
});
  const client = new Client({
    authTimeoutMs: 20000,
    takeoverOnConflict: true,
    authStrategy,
    restartOnAuthFail: true,
    puppeteer: {
      ignoreDefaultArgs: ['--enable-automation', '--disable-dev-shm-usage'],
      headless: true,
      args: ['--no-sandbox', '--disable-gpu-driver-bug-workarounds', '--disable-setuid-sandbox', '--unhandled-rejections=strict','--disable-dev-shm-usage','--disable-accelerated-2d-canvas','--no-first-run','--no-zygote', '--disable-gpu',  '--log-level=3',  '--no-default-browser-check',  '--disable-site-isolation-trials',  '--no-experiments',  '--ignore-gpu-blacklist',  '--ignore-certificate-errors',  '--ignore-certificate-errors-spki-list',  '--disable-extensions',  '--disable-default-apps',  '--enable-features=NetworkService',  '--disable-webgl',  '--disable-threaded-animation',  '--disable-threaded-scrolling',  '--disable-in-process-stack-traces',  '--disable-histogram-customizer',  '--disable-gl-extensions',  '--disable-composited-antialiasing',  '--disable-canvas-aa',  '--disable-3d-apis',  '--disable-accelerated-jpeg-decoding',  '--disable-accelerated-mjpeg-decode',  '--disable-app-list-dismiss-on-blur',  '--disable-accelerated-video-decode']
    },
  });

  client.on("disconnected", async (reason) => {
    await client.destroy();
    if (reason == "NAVIGATION" || reason == "LOGOUT") {
      const folderPath = path.join(
        __dirname,
        `../../../.wwebjs_auth/session-${client.authStrategy.clientId}`
      );
      fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.log(`Error deleting folder: ${err.message}`);
        } else {
          console.log("Folder deleted successfully");
        }
      });
    }
    client.initialize();
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
        io.emit("qr", "/qr.png");; // Envia o caminho da imagem para o frontend
      });

      // Exibir o QR Code no terminal para debug
      qrCodeTerminal.generate(qr, { small: true });
    } catch (err) {
      console.error("Erro ao processar QR Code:", err);
    }
  });

  client.on("ready", () => {
    console.log("Cliente do WhatsApp está pronto!");
  });

  client.initialize();

  return client;
}
