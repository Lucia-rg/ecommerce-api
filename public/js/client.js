const socket = io();

let currentView = 'home';

socket.on('connect', () => {
    console.log('✅ Conectado al servidor WebSocket');
    updateConnectionStatus(true);

    if(currentView === 'realtimeproducts') {
        requestProducts();
    }
});

// Evento cuando se desconecta
socket.on('disconnect', () => {
    console.log('❌ Desconectado del servidor');
    updateConnectionStatus(false);
});

function updateConnectionStatus(isConnected) {
    const statusElement = document.getElementById('connectionStatus');

    if(statusElement) {
        statusElement.className = isConnected ? 'badge bg-success fs-6' : 'badge bg-danger fs-6';
        statusElement.innerHTML = isConnected ? '<i class="fas fa-wifi me-1"></i>Conectado' :  '<i class="fas fa-wifi-slash me-1"></i>Desconectado';
    }
}

// Productos tiempo real

window.createProduct = function(productData) {
    if(socket.connected){
        socket.emit('createProduct', productData);
    }
}

window.deleteProduct = function(productId) {
    if(socket.connected) {
        socket.emit('deleteProduct', productId);
    }
}

window.requestProducts = function() {
    if(socket.connected) {
        socket.emit('requestProducts');
    }
}


