document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // CONFIGURACIÓN
    // --------------------------------------------------------------------------
    const API_URL = 'https://693b8fc89b80ba7262cda8b5.mockapi.io/api/v1/productos';

    // Referencias del DOM
    const shopContainer = document.getElementById('shopLane');
    const cartButton = document.getElementById('cartButton');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartContents = document.getElementById('cartContents');
    const modalTotal = document.getElementById('modalTotal');
    const clearCartBtn = document.getElementById('clearCart');
    const sendCartBtn = document.getElementById('sendCart');
    const cartCountBubble = document.getElementById('cartCount');
    const backdrop = document.querySelector('.cart-modal-backdrop');

    let cart = [];
    let products = [];

    // --------------------------------------------------------------------------
    // 1. INICIALIZACIÓN
    // --------------------------------------------------------------------------
    function init() {
        // Recuperar carrito guardado
        try {
            const saved = localStorage.getItem('silvia_cart');
            if (saved) cart = JSON.parse(saved);
        } catch (e) {
            localStorage.removeItem('silvia_cart');
        }

        updateCartUI(); // Actualizar el numerito rojo
        fetchProducts(); // Traer productos de la API
    }

    // --------------------------------------------------------------------------
    // 2. OBTENER PRODUCTOS (FETCH)
    // --------------------------------------------------------------------------
    async function fetchProducts() {
        try {
            shopContainer.innerHTML = '<p style="text-align:center">Cargando delicias...</p>';
            
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Error de conexión');
            
            products = await res.json();
            renderShop(products);

        } catch (error) {
            console.error(error);
            shopContainer.innerHTML = '<p style="text-align:center; color:red">Hubo un error cargando los productos.</p>';
        }
    }

    // --------------------------------------------------------------------------
    // 3. RENDERIZAR TIENDA (TARJETAS)
    // --------------------------------------------------------------------------
    function renderShop(list) {
        shopContainer.innerHTML = '';
        const categories = [...new Set(list.map(p => p.category))];

        categories.forEach(cat => {
            const row = document.createElement('div');
            row.className = 'category-row';
            row.innerHTML = `<h3>${cat}</h3>`;

            const lane = document.createElement('div');
            lane.className = 'shop-lane';

            const catProducts = list.filter(p => p.category === cat);

            catProducts.forEach(prod => {
                const card = document.createElement('article');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${prod.img}" alt="${prod.title}" onerror="this.src='https://placehold.co/300x200?text=Sin+Foto'">
                    <div class="product-info">
                        <h4>${prod.title}</h4>
                        <p style="font-size:0.9em; color:#666;">${prod.desc}</p>
                        <p class="price">$${prod.price}</p>
                        <button class="btn-add" data-id="${prod.id}">Agregar al carrito</button>
                    </div>
                `;
                lane.appendChild(card);
            });

            row.appendChild(lane);
            shopContainer.appendChild(row);
        });
    }

    // --------------------------------------------------------------------------
    // 4. DELEGACIÓN DE EVENTOS (DETECTAR CLIC EN BOTONES)
    // --------------------------------------------------------------------------
    shopContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add')) {
            const id = e.target.getAttribute('data-id');
            addToCart(id);
        }
    });

    // --------------------------------------------------------------------------
    // 5. LÓGICA DEL CARRITO
    // --------------------------------------------------------------------------
    function addToCart(id) {
        // Usamos '==' para que funcione con texto o número
        const prod = products.find(p => p.id == id);
        
        if (!prod) return; // Si no existe, salimos

        const existing = cart.find(item => item.id == id);

        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...prod, qty: 1 });
        }

        saveCart();
        updateCartUI();
        
        // Feedback visual en el botón
        const btn = document.querySelector(`.btn-add[data-id="${id}"]`);
        if(btn) {
            const originalText = btn.innerText;
            btn.innerText = "¡Agregado!";
            setTimeout(() => btn.innerText = originalText, 1000);
        }
    }

    function saveCart() {
        localStorage.setItem('silvia_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        // Actualizamos burbuja roja
        const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCountBubble.textContent = totalQty;
    }

    // --------------------------------------------------------------------------
    // 6. RENDERIZAR MODAL DEL CARRITO (CON DESGLOSE Y TOTAL)
    // --------------------------------------------------------------------------
    function renderCartModal() {
        cartContents.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartContents.innerHTML = '<p style="text-align:center; color:#999;">Tu carrito está vacío.</p>';
            modalTotal.textContent = '$0';
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            // HTML de cada fila del carrito
            div.innerHTML = `
                <div>
                    <strong>${item.title}</strong><br>
                    <small>$${item.price} x ${item.qty}</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button class="qty-btn decr" data-index="${index}">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn incr" data-index="${index}">+</button>
                    <button class="qty-btn del" data-index="${index}" style="background:#ffcccc; color:red;">×</button>
                </div>
            `;
            cartContents.appendChild(div);
        });

        modalTotal.textContent = `$${total}`;
    }

    // --------------------------------------------------------------------------
    // 7. EVENTOS DENTRO DEL CARRITO (+, -, Eliminar)
    // --------------------------------------------------------------------------
    cartContents.addEventListener('click', (e) => {
        const btn = e.target;
        // Si no es un botón, no hacemos nada
        if (!btn.classList.contains('qty-btn')) return;

        const index = btn.getAttribute('data-index');

        if (btn.classList.contains('incr')) {
            cart[index].qty++;
        } else if (btn.classList.contains('decr')) {
            cart[index].qty--;
            if (cart[index].qty <= 0) cart.splice(index, 1);
        } else if (btn.classList.contains('del')) {
            cart.splice(index, 1);
        }

        saveCart();
        renderCartModal(); // Re-dibujamos el carrito
        updateCartUI();    // Actualizamos burbuja
    });

    // --------------------------------------------------------------------------
    // 8. BOTONES GENERALES (ABRIR, CERRAR, VACIAR, ENVIAR)
    // --------------------------------------------------------------------------
    
    // Abrir modal
    cartButton.addEventListener('click', () => {
        renderCartModal();
        cartModal.setAttribute('aria-hidden', 'false');
    });

    // Cerrar modal
    function closeModal() {
        cartModal.setAttribute('aria-hidden', 'true');
    }
    closeCart.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // Vaciar Carrito
    clearCartBtn.addEventListener('click', () => {
        if(confirm('¿Estás seguro de vaciar el carrito?')) {
            cart = [];
            saveCart();
            renderCartModal();
            updateCartUI();
        }
    });

    // Finalizar Compra
    sendCartBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('El carrito está vacío');
        
        const pedido = cart.map(i => `• ${i.title} (x${i.qty}) - $${i.price * i.qty}`).join('\n');
        const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
        
        const cuerpoMail = encodeURIComponent(`Hola Silvia!\n\nQuiero realizar el siguiente pedido:\n\n${pedido}\n\nTotal: $${total}\n\nEspero confirmación. Gracias!`);
        window.location.href = `mailto:tuemail@ejemplo.com?subject=Nuevo Pedido Web&body=${cuerpoMail}`;
    });

    // Inicializar todo
    init();
});