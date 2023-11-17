const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Chave secreta para assinar os tokens JWT
const secretKey = '123456';

// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json());

// Função para gerar o token JWT
function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Define o tempo de expiração do token para 1 hora
}

// Rota para geração do token JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica as credenciais do usuário (simplificado para fins didáticos)
  if (username === 'usuario' && password === 'senha') {
    // Gera o token com as informações do usuário
    const token = generateToken({ username });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Middleware para verificar se o token é válido
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, '123456', (err, user) => {
          console.log(err);
        if (err) return res.status(403);
        req.user = user;
        next();
    });
}

// Rotas protegidas por autenticação
app.get('/status', authenticateToken, (req, res) => {
  res.json({ message: 'API is up and running' });
});

app.post('/client-data', authenticateToken, (req, res) => {
  console.log('Dados do Cliente:', req.body);
  res.json({ message: 'Dados do cliente recebidos com sucesso' });
});

app.post('/authorize', authenticateToken, (req, res) => {
  const { name, age } = req.body;

  if (age > 18) {
    res.json({ message: 'Autorizado' });
  } else {
    res.status(401).json({ message: 'Não autorizado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
