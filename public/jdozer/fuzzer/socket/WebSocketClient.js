
Ext.define('fuzzer.socket.WebSocketClient', {
    alternateClassName: 'WebSocketClient',
    constructor: function (cfg) {

        this.socket = io('http://localhost:3000', {
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('✅ Conectado al servidor Socket.io');
            console.log('ID del socket:', this.socket.id);
        });

        this.socket.on('connection', (data) => {
            console.log('📩 Evento de conexión:', data);
        });

        this.socket.on('message', (data) => {
            console.log('📩 Mensaje:', data);
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 Desconectado');
        });
    },

    sendMessage: function (message) {
        this.socket.emit('message', message);
    }

});