import express from "express";
import http from "http";
import { Server } from "socket.io"; // Ajuste para o export correto
import path from "path";
import { initializeWhatsApp } from "./src/qrCode.js";
import { handleMessages } from "./src/messages.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join("./public/index.html"));
});

// Usando async/await para garantir que o client foi inicializado antes de chamar handleMessages
function startServer() {
  try {
    const client = initializeWhatsApp(io); // Aguardando o cliente ser inicializado
    handleMessages(client); // Passando o client para a função handleMessages
    server.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  } catch (error) {
    console.error("Erro ao inicializar o WhatsApp:", error);
  }
}

startServer();
