const socket = io();

class ProductHandler {
    constructor() {
        this.currentView = 'home';
        this.init();
    }

    init() {
        this.detectView();
        this.setupEventListeners();
        this.setupSocketEvents();
    }

    detectView() {
        const path = window.location.pathname;
        if (path.includes('realtimeproducts')) {
            this.currentView = 'realtimeproducts';
        } else if (path.includes('home')) {
            this.currentView = 'home';
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const deleteButton = e.target.closest('[data-action="delete-product"]');
        
            if (deleteButton) {
            
                if (deleteButton.dataset.productId) {
                    this.deleteProduct(deleteButton.dataset.productId);
                } else {
                    console.log('❌ productId no encontrado en dataset');
                }
            }
        });

        const form = document.getElementById('productForm');
        if (form) {
            form.addEventListener('submit', (e) => { 
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        }
    }

    setupSocketEvents() {

        socket.on('connect', () => {
            console.log('✅ Conectado al servidor WebSocket');
            this.updateConnectionStatus(true);

            if(this.currentView === 'realtimeproducts') {
                this.requestProducts();
            }
        });

        socket.on('disconnect', () => {
            console.log('❌ Desconectado del servidor');
            this.updateConnectionStatus(false);
        });

        socket.on('productUpdated', (products) => {
            if (this.currentView === 'realtimeproducts') {
                this.updateProductsTable(products);
            }
        });

    }

    handleFormSubmit(form) {
        if(!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);
        const productData = {
            title: formData.get('title'),
            description: formData.get('description'),
            code: formData.get('code'),
            price: parseFloat(formData.get('price')),
            status: document.getElementById('status').checked,
            stock: parseInt(formData.get('stock')),
            category: formData.get('category'),
            thumbnails: formData.get('thumbnails') ? formData.get('thumbnails') : []
        };

        this.createProduct(productData);
        form.reset();
        form.classList.remove('was-validated');
        console.log('📤 Enviando producto:', productData);
    }

    createProduct(productData) {
        if(socket.connected){
            socket.emit('createProduct', productData);
        }
    }

    deleteProduct(productId) {
        if(socket.connected) {
            socket.emit('deleteProduct', productId);
        } else {
            console.log('❌ No conectado, no se puede eliminar');
        }
    }

    requestProducts() {
        if(socket.connected) {
            socket.emit('requestProducts');
        }
    }

    updateProductsTable(products) {
        const tbody = document.getElementById('productsTableBody');
        const productsCounter = document.getElementById('productsCount');

        if(products.length === 0){
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        <i class="fas fa-box-open me-2"></i>No hay productos
                    </td>
                </tr>
            
            `;
            productsCounter.textContent = '0';
            return;
        }

        tbody.innerHTML = products.map(product => `
                <tr data-product-id="${product.id}">
                    <td>
                        <strong>${product.title}</strong>
                        <br>
                        <small class="text-muted">${product.category}</small>
                    </td>

                    <td>
                    $${product.price}
                    </td>

                    <td>
                        <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">${product.stock}</span>
                    </td>

                    <td>
                        <button class="btn btn-sm btn-outline-secondary" 
                                data-action="delete-product"
                                data-product-id="${product.id}"
                                title="Eliminar producto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                    
                </tr>
            
            `
        ).join('');
        productsCounter.textContent = `${products.length}`;
    }

    updateConnectionStatus(isConnected) {
        const statusElement = document.getElementById('connectionStatus');

        if(statusElement) {
            statusElement.className = isConnected ? 'badge bg-success fs-6' : 'badge bg-danger fs-6';
            statusElement.innerHTML = isConnected ? '<i class="fas fa-wifi me-1"></i>Conectado' :  '<i class="fas fa-wifi-slash me-1"></i>Desconectado';
        }

    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductHandler();
});




