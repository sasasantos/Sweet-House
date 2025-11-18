/* ============================================
   JAVASCRIPT PRINCIPAL - P.S. SWEET HOUSE
   ============================================
   
   Este arquivo contém toda a lógica JavaScript
   para interatividade e funcionalidades do site.
   
   ÍNDICE:
   1. Configurações Globais
   2. Menu Hambúrguer
   3. Carrinho de Compras
   4. Filtros de Menu
   5. FAQ - Acordeões
   6. Chat Widget
   7. Formulários
   8. Animações de Scroll
   9. Lightbox de Galeria
   10. Utilitários
   
   ============================================ */

// ============================================
// 1. CONFIGURAÇÕES GLOBAIS
// ============================================

const config = {
    animationDuration: 300,
    scrollOffset: 80,
};

// Estado Global
const state = {
    cart: [],
    cartTotal: 0,
    isCartOpen: false,
    isChatOpen: true,
};

// ============================================
// 2. MENU HAMBÚRGUER
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

/**
 * Toggle do menu hambúrguer
 */
function toggleHamburgerMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

/**
 * Fechar menu ao clicar em um link
 */
function closeHamburgerMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

// Event Listeners - Menu Hambúrguer
hamburger?.addEventListener('click', toggleHamburgerMenu);

navLinks.forEach(link => {
    link.addEventListener('click', closeHamburgerMenu);
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
        closeHamburgerMenu();
    }
});

// ============================================
// 3. CARRINHO DE COMPRAS
// ============================================

const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.querySelector('.cart-modal');
const closeCartBtn = document.querySelector('.close-btn');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const addToCartBtns = document.querySelectorAll('.btn-add-cart');

/**
 * Abrir carrinho
 */
function openCart() {
    cartModal.classList.add('active');
    state.isCartOpen = true;
    document.body.style.overflow = 'hidden';
}

/**
 * Fechar carrinho
 */
function closeCart() {
    cartModal.classList.remove('active');
    state.isCartOpen = false;
    document.body.style.overflow = 'auto';
}

/**
 * Adicionar produto ao carrinho
 */
function addToCart(productName, price = 10) {
    const existingItem = state.cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            name: productName,
            price: price,
            quantity: 1,
            id: Date.now()
        });
    }
    
    updateCart();
    showNotification(`${productName} adicionado ao carrinho!`);
}

/**
 * Remover produto do carrinho
 */
function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    updateCart();
}

/**
 * Atualizar exibição do carrinho
 */
function updateCart() {
    // Atualizar contador
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar total
    state.cartTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Atualizar itens exibidos
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        cartItems.innerHTML = state.cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>Qtd: ${item.quantity} × R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="btn btn-small" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `).join('');
    }
    
    // Atualizar total
    const totalElement = document.querySelector('#cartTotal');
    if (totalElement) {
        totalElement.textContent = `R$ ${state.cartTotal.toFixed(2)}`;
    }
}

// Event Listeners - Carrinho
cartBtn?.addEventListener('click', openCart);
closeCartBtn?.addEventListener('click', closeCart);

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const productName = btn.getAttribute('data-product');
        addToCart(productName);
    });
});

// Fechar carrinho ao clicar fora
cartModal?.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCart();
    }
});

// ============================================
// 4. FILTROS DE MENU
// ============================================

const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

/**
 * Filtrar produtos por categoria
 */
function filterMenu(category) {
    menuItems.forEach(item => {
        if (category === 'todos' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Event Listeners - Filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover active de todos
        filterBtns.forEach(b => b.classList.remove('active'));
        // Adicionar active ao clicado
        btn.classList.add('active');
        // Filtrar
        const category = btn.getAttribute('data-filter');
        filterMenu(category);
    });
});

// Inicializar com transição suave
menuItems.forEach(item => {
    item.style.transition = 'all 0.3s ease';
});

// ============================================
// 5. FAQ - ACORDEÕES
// ============================================

const faqItems = document.querySelectorAll('.faq-item');
const faqQuestions = document.querySelectorAll('.faq-question');

/**
 * Toggle FAQ item
 */
function toggleFaqItem(item) {
    const isActive = item.classList.contains('active');
    
    // Fechar todos os outros
    faqItems.forEach(i => {
        if (i !== item) {
            i.classList.remove('active');
        }
    });
    
    // Toggle o atual
    item.classList.toggle('active');
}

// Event Listeners - FAQ
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        toggleFaqItem(item);
    });
});

// ============================================
// 6. CHAT WIDGET
// ============================================

const chatHeader = document.getElementById('chatHeader');
const chatToggle = document.getElementById('chatToggle');
const chatSend = document.getElementById('chatSend');
const chatInput = document.getElementById('chatInput');
//const chatSend = document.querySelector('#chatSend');



const chatResponses = {
    'oi': 'Olá! Como posso ajudá-lo?',
    'olá': 'Olá! Como posso ajudá-lo?',
    'preço': 'Nossos preços variam conforme o produto. Consulte o menu para mais informações.',
    'entrega': 'Fazemos entregas em 3 a 7 dias úteis. Consulte a seção de encomendas para mais detalhes.',
    'contato': 'Você pode nos contatar pelo telefone (11) 98765-4321 ou email contato@pssweethouse.com.br',
    'horário': 'Nosso horário é de segunda a sexta das 9h às 18h, e sábado das 10h às 16h.',
    'default': 'Desculpe, não entendi. Pode reformular sua pergunta?'
};

/**
 * Adicionar mensagem ao chat
 */
function addChatMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Enviar mensagem do chat
 */
function sendChatMessage() {
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Adicionar mensagem do usuário
    addChatMessage(message, true);
    chatInput.value = '';
    
    // Simular resposta do bot
    setTimeout(() => {
        const lowerMessage = message.toLowerCase();
        let response = chatResponses.default;
        
        for (const key in chatResponses) {
            if (lowerMessage.includes(key)) {
                response = chatResponses[key];
                break;
            }
        }
        
        addChatMessage(response, false);
    }, 500);
}

/**
 * Toggle chat widget
 */
function toggleChat() {
    console.log('Toggle chat widget');

    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.querySelector('.chat-input');

    state.isChatOpen = !state.isChatOpen;

    // Alterna o ícone
    chatToggle.textContent = state.isChatOpen ? '−' : '+';

    if (state.isChatOpen) {
        chatMessages.style.display = 'block';
        chatInput.style.display = 'flex';

        // 🔥 Reposiciona o scroll para o final
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
        chatMessages.style.display = 'none';
        chatInput.style.display = 'none';
    }
}


// Event Listeners - Chat
chatHeader?.addEventListener('click', toggleChat);
chatSend?.addEventListener('click', sendChatMessage);
chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});


// ============================================
// 7. FORMULÁRIOS
// ============================================

const contatoForm = document.querySelector('#contatoForm');
const newsletterForm = document.querySelector('#newsletterForm');

/**
 * Validar email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Enviar formulário de contato
 */
function handleContatoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contatoForm);
    const email = formData.get('email');
    
    // Validação
    if (!isValidEmail(email)) {
        showNotification('Email inválido!', 'error');
        return;
    }
    
    // Simular envio
    const submitBtn = contatoForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Mensagem enviada com sucesso!', 'success');
        contatoForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

/**
 * Enviar formulário de newsletter
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (!isValidEmail(email)) {
        showNotification('Email inválido!', 'error');
        return;
    }
    
    showNotification('Inscrição realizada com sucesso!', 'success');
    newsletterForm.reset();
}

// Event Listeners - Formulários
contatoForm?.addEventListener('submit', handleContatoSubmit);
newsletterForm?.addEventListener('submit', handleNewsletterSubmit);

// ============================================
// 8. ANIMAÇÕES DE SCROLL
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animação aos elementos
document.querySelectorAll('.menu-item, .step, .diferencial-card, .galeria-item, .testimonial, .blog-card, .value-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// 9. LIGHTBOX DE GALERIA
// ============================================

const galeriaItems = document.querySelectorAll('.galeria-item');

/**
 * Abrir lightbox
 */
function openLightbox(item) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <div class="lightbox-image">
                ${item.querySelector('.galeria-placeholder').innerHTML}
            </div>
            <p class="lightbox-title">${item.querySelector('p').textContent}</p>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Fechar lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.remove();
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.remove();
        }
    });
}

// Event Listeners - Galeria
galeriaItems.forEach(item => {
    item.addEventListener('click', () => {
        openLightbox(item);
    });
});

// ============================================
// 10. UTILITÁRIOS
// ============================================

/**
 * Mostrar notificação
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Smooth scroll para elementos
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Efeito parallax no hero
 */
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    });
}

/**
 * Adicionar estilos de animação ao documento
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .lightbox-content {
        background-color: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 600px;
        position: relative;
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .lightbox-close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #333;
    }
    
    .lightbox-image {
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, #F9CBD6 0%, #F2AFBC 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 120px;
        margin-bottom: 16px;
    }
    
    .lightbox-title {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
    }
`;
document.head.appendChild(style);

// ============================================
// INICIALIZAÇÃO
// ============================================

console.log('✨ P.S. Sweet House - Site carregado com sucesso!');
console.log('🍰 Bem-vindo ao nosso site de doces artesanais!');

// Inicializar carrinho
updateCart();

// Log de eventos importantes
document.addEventListener('DOMContentLoaded', () => {
    console.log('📦 DOM carregado e pronto para interação');
});

// Tracking básico
window.addEventListener('beforeunload', () => {
    console.log('👋 Obrigado por visitar a P.S. Sweet House!');
});


