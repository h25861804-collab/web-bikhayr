// ══════════════════ DATA MENU ══════════════════
const menuData = [
  // KEBAB
  { id:1, cat:'kebab', emoji:'🌯', image:'kebab1.jpg', name:'Kebab Daging Sapi', desc:'Daging sapi pilihan, sayuran segar, saus khas BIKHAYR, dibungkus roti pita lembut nan harum.', price:28000, badge:'Best Seller' },
  { id:2, cat:'kebab', emoji:'🌯', image:'kebab2.jpeg', name:'Kebab Ayam Spesial', desc:'Fillet ayam juicy dengan bumbu rempah timur tengah, dilengkapi saus garlic dan sayuran renyah.', price:25000, badge:'Halal' },
  { id:3, cat:'kebab', emoji:'🌯', image:'kebab3.jpeg', name:'Kebab Double Daging', desc:'Porsi ekstra dengan dua lapis daging sapi dan ayam, saus pedas manis yang tak terlupakan.', price:35000, badge:'Populer' },
  // BURGER
  { id:4, cat:'burger', emoji:'🍔', image:'burger1.jpg', name:'Beef Burger Classic', desc:'Patty sapi tebal 120g, keju cheddar leleh, selada, tomat, dan saus spesial BIKHAYR.', price:35000, badge:'Best Seller' },
  { id:5, cat:'burger', emoji:'🍔', image:'burger2.jpg', name:'Double Beef Burger', desc:'Dua patty sapi jumbo dengan keju ganda, bacon-free, dan saus BBQ autentik.', price:48000, badge:'Premium' },
  { id:6, cat:'burger', emoji:'🍔', image:'burger3.jpg', name:'Beef Mushroom Burger', desc:'Patty sapi dengan tumisan jamur bawang, keju mozarella, dan mayo herbs segar.', price:42000, badge:'Favorit' },
  // CHICKEN BURGER
  { id:7, cat:'chicken-burger', emoji:'🍗', image:'chiken1.jpg', name:'Crispy Chicken Burger', desc:'Fillet ayam crispy dengan tepung bumbu rempah, selada segar, dan saus honey mustard.', price:30000, badge:'Crispy' },
  { id:8, cat:'chicken-burger', emoji:'🍗', image:'chiken2.jpg', name:'Spicy Chicken Burger', desc:'Ayam goreng dengan balutan bumbu pedas level 1–3, dijamin bikin ketagihan!', price:32000, badge:'Pedas' },
  { id:9, cat:'chicken-burger', emoji:'🍗', image:'chiken3.jpg', name:'Chicken Cheese Burger', desc:'Crispy chicken dengan lelehan keju cheddar premium dan saus spesial creamy BIKHAYR.', price:36000, badge:'Cheesy' },
  // SANDWICH
  { id:10, cat:'sandwich', emoji:'🥪', image:'sandwich1.jpg', name:'Chicken Sandwich Classic', desc:'Roti gandum lembut berisi ayam suwir saus teriyaki, selada, tomat, dan timun renyah.', price:22000, badge:'Light' },
  { id:11, cat:'sandwich', emoji:'🥪', image:'sandwich2.jpg', name:'Grilled Chicken Sandwich', desc:'Fillet ayam panggang tanpa goreng, lebih sehat dengan sayuran segar dan saus yogurt.', price:27000, badge:'Sehat' },
  { id:12, cat:'sandwich', emoji:'🥪', image:'sandwich3.jpg', name:'Chicken Club Sandwich', desc:'Sandwich berlapis tiga dengan ayam, telur, tomat, selada, dan mayo spesial yang kaya rasa.', price:32000, badge:'Spesial' },
];

let cart = [];

// ══════════════════ RENDER MENU ══════════════════
function renderMenuCards(data, containerId, showAll = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = showAll ? data : data.slice(0, 4);
  container.innerHTML = items.map(item => `
      <div class="menu-card" data-cat="${item.cat}">
        <div class="menu-card-img">
          <img src="${item.image}" alt="${item.name}" />
          <div class="menu-card-badge">${item.badge}</div>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-name">${item.name}</div>
          <div class="menu-card-desc">${item.desc}</div>
          <div class="menu-card-footer">
            <div class="menu-card-price">Rp ${item.price.toLocaleString('id-ID')}</div>
            <button class="btn-add" id="addBtn${item.id}" onclick="addToCart(${item.id})">
              <i class="fas fa-plus"></i> Tambah
            </button>
          </div>
        </div>
      </div>
    `).join('');
}

function filterMenu(cat, btn) {
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'all' ? menuData : menuData.filter(m => m.cat === cat);
  renderMenuCards(filtered, 'menuGrid', true);
}

// ══════════════════ CART ══════════════════
function addToCart(id) {
  const item = menuData.find(m => m.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartBadge();
  showToast(`${item.emoji} ${item.name} ditambahkan!`);

  const btn = document.getElementById('addBtn' + id);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i> Ditambahkan';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="fas fa-plus"></i> Tambah';
    }, 1500);
  }
}

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartBadge();
  renderCart();
  showToast('Item dihapus dari keranjang.');
}

function renderCart() {
  updateCartBadge();
  const listEl = document.getElementById('cartItemsList');
  const emptyEl = document.getElementById('cartEmptyMsg');
  const summaryEl = document.getElementById('cartSummaryPanel');

  if (cart.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
    summaryEl.style.display = 'none';
  } else {
    emptyEl.style.display = 'none';
    summaryEl.style.display = 'block';
    listEl.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="ci-emoji">${item.emoji}</div>
          <div class="ci-info">
            <div class="ci-name">${item.name}</div>
            <div class="ci-price">Rp ${item.price.toLocaleString('id-ID')} / pcs</div>
          </div>
          <div class="ci-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <div class="ci-subtotal">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
          <button class="ci-delete" onclick="removeItem(${item.id})"><i class="fas fa-trash-alt"></i></button>
        </div>
      `).join('');
  }

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  document.getElementById('summarySubtotal').textContent = 'Rp ' + total.toLocaleString('id-ID');
  document.getElementById('summaryTotal').textContent = 'Rp ' + total.toLocaleString('id-ID');
}

// ══════════════════ WHATSAPP ══════════════════
const WA_NUMBER = '6282282257018'; // ← GANTI NOMOR WA DI SINI

function sendWhatsApp() {
  if (cart.length === 0) { showToast('Keranjang masih kosong!'); return; }
  const name = document.getElementById('buyerName').value.trim();
  const address = document.getElementById('buyerAddress').value.trim();
  const note = document.getElementById('buyerNote').value.trim();

  if (!name) { showToast('Nama lengkap wajib diisi!'); document.getElementById('buyerName').focus(); return; }
  if (!address) { showToast('Alamat pengiriman wajib diisi!'); document.getElementById('buyerAddress').focus(); return; }

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const items = cart.map(c => `- ${c.qty}x ${c.name} (Rp ${c.price.toLocaleString('id-ID')})`).join('\n');

  const msg = `Assalamu'alaikum BIKHAYR, saya ingin memesan:

${items}

Total Belanja: Rp ${total.toLocaleString('id-ID')}

Data Pengiriman:
Nama: ${name}
Alamat: ${address}
Catatan: ${note || 'Tidak ada catatan'}

Mohon dikonfirmasi pesanannya, terima kasih! 🙏`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
}

// ══════════════════ NAVIGATION ══════════════════
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const map = { home:0, menu:1, about:2, contact:3 };
  const links = document.querySelectorAll('.nav-link');
  if (map[page] !== undefined) links[map[page]].classList.add('active');

  if (page === 'cart') renderCart();
  if (page === 'menu') renderMenuCards(menuData, 'menuGrid', true);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ══════════════════ TOAST ══════════════════
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ══════════════════ INIT ══════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Featured menu on home (3 best sellers)
  renderMenuCards([menuData[0], menuData[3], menuData[6], menuData[9]], 'featuredMenu', true);
  // Full menu page
  renderMenuCards(menuData, 'menuGrid', true);
  // Initial cart render
  renderCart();
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  if (!menu.contains(e.target) && !ham.contains(e.target)) {
    menu.classList.remove('open');
  }
});
