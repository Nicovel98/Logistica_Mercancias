const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const clientesRouter = require('./routes/clientes');
const productosRouter = require('./routes/productos');
const transportistasRouter = require('./routes/transportistas');
const rutasRouter = require('./routes/rutas');
const pedidosRouter = require('./routes/pedidos');
const enviosRouter = require('./routes/envios');
const estadosEnvioRouter = require('./routes/estadosEnvio');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);
    socket.on('disconnect', () => {
        console.log('Socket desconectado:', socket.id);
    });
});

app.use('/api/clientes', clientesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/transportistas', transportistasRouter);
app.use('/api/rutas', rutasRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/envios', enviosRouter);
app.use('/api/estados-envio', estadosEnvioRouter);

app.get('/', (req, res) => {
    res.json({ message: 'API Logistica Mercancias activa' });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
