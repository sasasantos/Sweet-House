const state = { cart: [], isChatOpen: true, orderConfirmed: false };
const $ = (selector, root = document) => root.querySelector(selector); const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = value => `R$ ${value.toFixed(2).replace('.', ',')}`;

const header = $('#header');
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 18), { passive: true });
const hamburger = $('#hamburger'); const navMenu = $('#navMenu');
function closeMenu() { navMenu?.classList.remove('active'); hamburger?.classList.remove('active'); hamburger?.setAttribute('aria-expanded', 'false'); }
hamburger?.addEventListener('click', event => { event.stopPropagation(); const open = navMenu.classList.toggle('active'); hamburger.classList.toggle('active', open); hamburger.setAttribute('aria-expanded', String(open)); });
$$('.nav-link').forEach(link => link.addEventListener('click', closeMenu)); document.addEventListener('click', event => { if (!event.target.closest('.navbar')) closeMenu(); });

const modal = $('#cartModal'); const cartItems = $('#cartItems'); const cartCount = $('#cartCount'); const cartTotal = $('#cartTotal'); const checkoutButton = $('#checkoutBtn');
function notify(message, type = 'info') { const el = document.createElement('div'); el.className = `notification notification-${type}`; el.textContent = message; document.body.appendChild(el); setTimeout(() => el.remove(), 3200); }
function renderCart() {
  const items = state.cart.reduce((total, item) => total + item.quantity, 0); cartCount.textContent = items;
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0); cartTotal.textContent = money(total);
  checkoutButton.disabled = !state.cart.length;
  if (!state.cart.length) {
    cartItems.innerHTML = state.orderConfirmed
      ? '<div class="order-success"><span class="order-success-icon">✓</span><h3>Pedido realizado!</h3><p>Obrigada pela sua escolha. Entraremos em contato para confirmar os detalhes.</p><p class="empty-cart">Seu carrinho está vazio.</p></div>'
      : '<p class="empty-cart">Seu carrinho ainda está vazio.</p>';
    return;
  }
  cartItems.innerHTML = state.cart.map(item => `<div class="cart-item"><div><strong>${item.name}</strong><p>${item.quantity} × ${money(item.price)}</p></div><button class="btn" data-remove="${item.id}" type="button">Remover</button></div>`).join('');
  $$('[data-remove]', cartItems).forEach(button => button.addEventListener('click', () => { state.cart = state.cart.filter(item => item.id !== Number(button.dataset.remove)); state.orderConfirmed = false; renderCart(); }));
}
function openCart() { modal?.classList.add('active'); document.body.classList.add('modal-open'); modal?.querySelector('.close-btn')?.focus(); }
function closeCart() { modal?.classList.remove('active'); document.body.classList.remove('modal-open'); }
$('#cartBtn')?.addEventListener('click', openCart); $('#closeCart')?.addEventListener('click', closeCart); modal?.addEventListener('click', event => { if (event.target === modal) closeCart(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeCart(); closeMenu(); closeBlogStory(); } });
checkoutButton?.addEventListener('click', () => { if (!state.cart.length) return; state.cart = []; state.orderConfirmed = true; renderCart(); notify('Pedido realizado com sucesso!', 'success'); });
$$('.btn-add-cart').forEach(button => button.addEventListener('click', () => { const name = button.dataset.product; const price = Number(button.dataset.price); const current = state.cart.find(item => item.name === name); state.orderConfirmed = false; if (current) current.quantity += 1; else state.cart.push({ name, price, quantity: 1, id: Date.now() + Math.random() }); renderCart(); notify(`${name} foi para o seu carrinho.`); button.classList.add('added'); button.innerHTML = 'Adicionado <span>✓</span>'; setTimeout(() => { button.classList.remove('added'); button.innerHTML = 'Adicionar <span>+</span>'; }, 1600); }));

const items = $$('.menu-item'); $$('.filter-btn').forEach(button => button.addEventListener('click', () => { $$('.filter-btn').forEach(item => item.classList.remove('active')); button.classList.add('active'); const filter = button.dataset.filter; items.forEach(item => { const visible = filter === 'todos' || item.dataset.category === filter; item.classList.toggle('is-hidden', !visible); }); }));
$$('.faq-question').forEach(question => question.addEventListener('click', () => { const item = question.closest('.faq-item'); const open = item.classList.toggle('active'); question.setAttribute('aria-expanded', String(open)); $$('.faq-item').forEach(other => { if (other !== item) { other.classList.remove('active'); other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false'); } }); }));

const chatHeader = $('#chatHeader'); const chatToggle = $('#chatToggle'); const chatMessages = $('#chatMessages'); const chatInput = $('#chatInput');
const chatResponses = { oi: 'Olá! Como posso ajudar?', olá: 'Olá! Como posso ajudar?', preço: 'Os preços estão no nosso cardápio. Posso ajudar a encontrar algo especial.', entrega: 'Fazemos entregas em 3 a 7 dias úteis. Fale conosco para consultar a taxa.', contato: 'Você pode falar conosco pelo telefone (11) 98765-4321 ou pelo email contato@pssweethouse.com.br.', horário: 'Atendemos de segunda a sexta, das 9h às 18h, e sábado das 10h às 16h.' };
function addChatMessage(text, user = false) { const div = document.createElement('div'); div.className = `chat-message ${user ? 'user' : 'bot'}`; const p = document.createElement('p'); p.textContent = text; div.appendChild(p); chatMessages.appendChild(div); chatMessages.scrollTop = chatMessages.scrollHeight; }
function sendChat() { const text = chatInput.value.trim(); if (!text) return; addChatMessage(text, true); chatInput.value = ''; setTimeout(() => { const lower = text.toLowerCase(); const key = Object.keys(chatResponses).find(word => lower.includes(word)); addChatMessage(key ? chatResponses[key] : 'Posso ajudar com cardápio, preços, entrega ou contato.'); }, 450); }
function toggleChat() { state.isChatOpen = !state.isChatOpen; chatMessages.style.display = state.isChatOpen ? 'block' : 'none'; $('.chat-input').style.display = state.isChatOpen ? 'flex' : 'none'; chatToggle.textContent = state.isChatOpen ? '−' : '+'; chatHeader.setAttribute('aria-expanded', String(state.isChatOpen)); }
chatHeader?.addEventListener('click', toggleChat); $('#chatSend')?.addEventListener('click', sendChat); chatInput?.addEventListener('keydown', event => { if (event.key === 'Enter') sendChat(); });

$$('.contato-form,#newsletterForm').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); const email = form.querySelector('input[type="email"]'); if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { notify('Confira o email informado.', 'error'); email.focus(); return; } const button = form.querySelector('button[type="submit"]'); const original = button.innerHTML; button.disabled = true; button.textContent = 'Enviando…'; setTimeout(() => { notify(form.id === 'newsletterForm' ? 'Inscrição realizada com sucesso!' : 'Mensagem enviada com sucesso!', 'success'); form.reset(); button.disabled = false; button.innerHTML = original; }, 900); }));

const blogStories = {
  cupcakes: { category: 'Receita · 5 min', title: 'Como fazer cupcakes perfeitos em casa', body: 'O segredo está em misturar a massa apenas até incorporar os ingredientes. Asse em forno preaquecido, espere esfriar completamente e finalize com uma cobertura leve. Assim, seus cupcakes ficam macios, altos e prontos para receber a criatividade.' },
  conservacao: { category: 'Dica · 3 min', title: 'O segredo para conservar seus doces', body: 'Guarde cada doce de acordo com seus ingredientes: bolos e cupcakes com creme devem ficar refrigerados e protegidos da umidade. Retire da geladeira alguns minutos antes de servir para recuperar textura e aroma.' },
  historia: { category: 'Nossa história · 7 min', title: 'Onde tudo começou', body: 'A Sweet House nasceu em 2020, entre receitas compartilhadas e o desejo de transformar pequenos momentos em memórias doces. Desde então, cada criação é feita em pequenos lotes, com cuidado artesanal e muito carinho.' }
};
let activeBlogModal;
function closeBlogStory() { activeBlogModal?.remove(); activeBlogModal = null; }
function openBlogStory(story) { closeBlogStory(); const content = blogStories[story]; if (!content) return; activeBlogModal = document.createElement('div'); activeBlogModal.className = 'blog-story-modal'; activeBlogModal.setAttribute('role', 'dialog'); activeBlogModal.setAttribute('aria-modal', 'true'); activeBlogModal.innerHTML = `<article class="blog-story-content"><button class="lightbox-close blog-story-close" aria-label="Fechar história">×</button><span class="blog-category">${content.category}</span><h2>${content.title}</h2><p>${content.body}</p><button class="btn btn-primary blog-story-action" type="button">Voltar ao blog <span>←</span></button></article>`; document.body.appendChild(activeBlogModal); activeBlogModal.querySelector('.blog-story-close').addEventListener('click', closeBlogStory); activeBlogModal.querySelector('.blog-story-action').addEventListener('click', closeBlogStory); activeBlogModal.addEventListener('click', event => { if (event.target === activeBlogModal) closeBlogStory(); }); activeBlogModal.querySelector('.blog-story-close').focus(); }
$$('.blog-card [data-blog]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); openBlogStory(link.dataset.blog); }));

$$('.galeria-item').forEach(item => item.addEventListener('click', () => { const image = item.querySelector('img'); const lightbox = document.createElement('div'); lightbox.className = 'lightbox'; lightbox.innerHTML = `<div class="lightbox-content"><button class="lightbox-close" aria-label="Fechar imagem">×</button><div class="lightbox-image"><img src="${image.src}" alt="${image.alt}" /></div><p class="lightbox-title">${item.querySelector('span').textContent}</p></div>`; document.body.appendChild(lightbox); const close = () => lightbox.remove(); lightbox.querySelector('.lightbox-close').addEventListener('click', close); lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); }); }));

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 }); $$('.reveal').forEach(element => observer.observe(element));
renderCart();
