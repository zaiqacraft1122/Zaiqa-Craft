/* ==========================================================================
   ZAIQA CRAFT - MAIN JAVASCRIPT
   Handles products, cart, wishlist, search, modals, and dynamic rendering.
   ========================================================================== */

const PRODUCTS_DATA = [
  {
    id: 1,
    slug: "1kg-pure-chakwal-rewari-2",
    name: "1kg Pure Chakwal Rewari",
    category: "snacks",
    price: 1000.00,
    originalPrice: 1200.00,
    weight: "1kg",
    badge: "Special Heritage",
    rating: 5.0,
    reviewsCount: 28,
    subdesc: "Super Nayab Chakwal Rewari – Premium Jaggery & Pure Ghee\nExperience the Authentic Taste of Chakwal!",
    description: "Super Nayab Chakwal Rewari is handcrafted with centuries-old traditional recipes from Chakwal. Made with premium quality golden sesame seeds (til), pure organic desi ghee, and unrefined organic jaggery (gur). Crispy, aromatic, rich in authentic nutrition, and sealed for absolute freshness.",
    primaryImg: "assets/images/prod_rewari_1kg_4k.jpg",
    secondaryImg: "assets/images/prod_nayab_4k.jpg",
    variants: [
      { weight: "1kg", price: 1000.00, originalPrice: 1200.00 }
    ],
    inStock: true
  },
  {
    id: 2,
    slug: "crunchy-sev-sticks-3",
    name: "Crunchy Sev Sticks",
    category: "snacks",
    price: 1000.00,
    originalPrice: 1200.00,
    weight: "1kg",
    badge: "Tea-Time Favorite",
    rating: 4.9,
    reviewsCount: 19,
    subdesc: "Premium Thick Crunchy Sev Sticks\nA Tangy Tea-Time Delight",
    description: "Crispy, savory, and delicately spiced thick Sev sticks. Prepared with 100% pure chickpea gram flour (besan) and exquisite Pakistani spices for the perfect crunch with evening tea.",
    primaryImg: "assets/images/prod_sev_4k.jpg",
    secondaryImg: "assets/images/hero_gourmet_4k.jpg",
    variants: [
      { weight: "1kg", price: 1000.00, originalPrice: 1200.00 }
    ],
    inStock: true
  },
  {
    id: 3,
    slug: "pure-nayab-chakwal-rewari-5",
    name: "Pure Nayab Chakwal Rewari",
    category: "snacks",
    price: 250.00,
    originalPrice: null,
    weight: "250g",
    badge: "Best Seller",
    rating: 5.0,
    reviewsCount: 42,
    subdesc: "Super Nayab Chakwal Rewari – Premium Jaggery & Pure Ghee Savor the True Essence of Chakwal!",
    description: "Our signature Nayab Chakwal Rewari presented in elegant airtight packaging. Authentic Chakwali Gur and desi ghee formulation with golden sesame perfection.",
    primaryImg: "assets/images/prod_nayab_4k.jpg",
    secondaryImg: "assets/images/prod_rewari_1kg_4k.jpg",
    variants: [
      { weight: "250g", price: 250.00, originalPrice: null },
      { weight: "500g", price: 499.00, originalPrice: 550.00 },
      { weight: "1kg", price: 999.00, originalPrice: 1200.00 }
    ],
    inStock: true
  },
  {
    id: 4,
    slug: "snack-shack-box-12-in-1-different-delicious-snacks-6",
    name: "Snack Shack Box | 12 in 1 | different delicious snacks",
    category: "snacks",
    price: 999.00,
    originalPrice: 1200.00,
    weight: "1kg",
    badge: "Luxury Gift Box",
    rating: 5.0,
    reviewsCount: 56,
    subdesc: "Ultimate snack assortment featuring 12 different authentic Pakistani delicacies in one luxury celebration gift box.",
    description: "The ultimate celebration hamper! A curated 12-in-1 luxury box featuring our complete artisanal range: authentic Rewari, Crunchy Sev Sticks, Namak Paray, roasted nuts, sweet dates, sesame brittle, and dried fruits.",
    primaryImg: "assets/images/prod_snack_box_4k.jpg",
    secondaryImg: "assets/images/hero_gourmet_4k.jpg",
    variants: [
      { weight: "12-in-1 Box", price: 999.00, originalPrice: 1200.00 }
    ],
    inStock: true
  }
];

// Cart State Manager
class CartManager {
  static getCart() {
    try {
      return JSON.parse(localStorage.getItem('zaiqa_cart')) || [];
    } catch(e) {
      return [];
    }
  }

  static saveCart(cart) {
    localStorage.setItem('zaiqa_cart', JSON.stringify(cart));
    CartManager.updateCounters();
    if (document.getElementById('cartCenterModal')) {
      CartManager.renderCartModal();
    }
    if (typeof renderCartTable === 'function') {
      renderCartTable();
    }
    if (typeof updateSummary === 'function') {
      updateSummary();
    }
  }

  static addToCart(productId, weight = null, quantity = 1) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    let selectedVariant = product.variants[0];
    if (weight) {
      const found = product.variants.find(v => v.weight === weight);
      if (found) selectedVariant = found;
    }

    let cart = CartManager.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id && item.selectedWeight === selectedVariant.weight);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: selectedVariant.price,
        selectedWeight: selectedVariant.weight,
        image: product.primaryImg,
        quantity: quantity
      });
    }

    CartManager.saveCart(cart);
    showToast(`Added "${product.name}" (${selectedVariant.weight}) to cart!`);
    
    // Smoothly Zoom In Shopping Cart right into the center of the screen
    CartManager.openCartModal();
  }

  static removeFromCart(index) {
    let cart = CartManager.getCart();
    cart.splice(index, 1);
    CartManager.saveCart(cart);
  }

  static updateQuantity(index, quantity) {
    let cart = CartManager.getCart();
    if (quantity <= 0) {
      CartManager.removeFromCart(index);
      return;
    }
    cart[index].quantity = quantity;
    CartManager.saveCart(cart);
  }

  static getSubtotal() {
    const cart = CartManager.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  static updateCounters() {
    const cart = CartManager.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.my_cart_quantity').forEach(el => {
      el.textContent = totalCount;
      if (totalCount > 0) {
        el.classList.remove('d-none');
      } else {
        el.classList.add('d-none');
      }
    });

    const wishlist = (typeof WishlistManager !== 'undefined') ? WishlistManager.getWishlist() : [];
    document.querySelectorAll('.my_wish_quantity').forEach(el => {
      el.textContent = wishlist.length;
      if (wishlist.length > 0) {
        el.classList.remove('d-none');
      } else {
        el.classList.add('d-none');
      }
    });
  }

  static initCartModal() {
    if (document.getElementById('cartCenterModal')) return;

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'cartCenterModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'cartModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header py-3 px-4 border-bottom" style="background: #faf8f6;">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 42px; height: 42px; background: #fff5eb; color: var(--primary);">
                <i class="fa fa-shopping-cart fs-5"></i>
              </div>
              <div>
                <h5 class="modal-title fw-bold text-dark m-0" id="cartModalLabel">Your Shopping Cart</h5>
                <span class="small text-muted" id="cartModalItemCountText">0 items in your cart</span>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <!-- Trust Bar -->
          <div class="py-2 px-3 text-center small fw-semibold" style="background: #fff5eb; color: var(--primary); border-bottom: 1px solid #fee8d6;">
            <i class="fa fa-truck-fast me-1"></i> Cash on Delivery available across Pakistan!
          </div>

          <!-- Modal Body -->
          <div class="modal-body p-4" id="cartModalBody" style="max-height: 52vh; overflow-y: auto;">
            <!-- Cart items injected dynamically -->
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer p-4 border-top bg-light d-flex flex-column gap-2" id="cartModalFooter">
            <div class="d-flex justify-content-between align-items-center w-100 pb-2">
              <span class="text-muted fw-semibold fs-6">Estimated Subtotal:</span>
              <span class="fs-4 fw-bolder" style="color: var(--primary);" id="cartModalSubtotal">0.00 Rs.</span>
            </div>
            <div class="row g-2 w-100">
              <div class="col-sm-6 col-12">
                <a href="cart.html" class="btn btn-lg fw-bold text-white shadow-sm w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-pill" style="background-color: var(--primary);">
                  Proceed to Checkout <i class="fa fa-arrow-right"></i>
                </a>
              </div>
              <div class="col-sm-6 col-12">
                <a href="#" id="cartModalWhatsappBtn" target="_blank" class="whatsapp-direct-btn w-100 text-center py-3 rounded-pill d-flex align-items-center justify-content-center gap-2">
                  <i class="fab fa-whatsapp fs-5"></i> Order via WhatsApp
                </a>
              </div>
            </div>
            <div class="text-center w-100 mt-2">
              <button type="button" class="btn btn-link text-muted small text-decoration-none" data-bs-dismiss="modal">
                <i class="fa fa-plus me-1"></i> Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  static renderCartModal() {
    CartManager.initCartModal();
    const body = document.getElementById('cartModalBody');
    const footer = document.getElementById('cartModalFooter');
    const countText = document.getElementById('cartModalItemCountText');
    const subtotalEl = document.getElementById('cartModalSubtotal');
    const whatsappBtn = document.getElementById('cartModalWhatsappBtn');

    if (!body) return;

    const cart = CartManager.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = CartManager.getSubtotal();

    if (countText) countText.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'} in your cart`;
    if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString('en-PK', {minimumFractionDigits: 2})} Rs.`;

    if (whatsappBtn) {
      const itemsList = cart.map(i => `- ${i.name} (${i.selectedWeight}) x${i.quantity}: ${(i.price * i.quantity).toLocaleString()} Rs`).join('\n');
      const text = `Hello Zaiqa Craft! I would like to place an order from my Shopping Cart:\n\n${itemsList}\n\n*Estimated Total: ${subtotal.toLocaleString()} Rs.*\nPlease confirm delivery!`;
      whatsappBtn.href = `https://WA.me/+923074156658?text=${encodeURIComponent(text)}`;
    }

    if (cart.length === 0) {
      body.innerHTML = `
        <div class="text-center py-5 my-auto">
          <div class="rounded-circle d-inline-flex p-4 mb-3" style="background: #fdf6f0; color: var(--primary);">
            <i class="fa fa-shopping-basket fa-3x"></i>
          </div>
          <h5 class="fw-bold text-dark mb-2">Your Cart is Empty</h5>
          <p class="text-muted small mb-4">Discover authentic Chakwal snacks and delicious sweets to add to your cart.</p>
          <a href="shop.html" class="btn text-white fw-bold px-4 rounded-pill shadow-sm" style="background-color: var(--primary);" data-bs-dismiss="modal">
            Explore All Products
          </a>
        </div>
      `;
      if (footer) footer.classList.add('d-none');
    } else {
      if (footer) footer.classList.remove('d-none');
      body.innerHTML = cart.map((item, index) => `
        <div class="cart-modal-item d-flex gap-3 p-3 align-items-center">
          <img src="${item.image}" alt="${item.name}" class="rounded-3 shadow-sm flex-shrink-0" style="width: 70px; height: 70px; object-fit: cover; border: 1px solid #eee;">
          <div class="flex-grow-1 min-w-0">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <a href="product.html?slug=${item.slug}" class="fw-bold text-dark text-decoration-none fs-6 mb-1 d-block text-truncate" style="max-width: 280px;">
                  ${item.name}
                </a>
                <span class="badge rounded-pill text-white fw-semibold" style="background-color: var(--secondary); font-size: 0.72rem;">${item.selectedWeight}</span>
              </div>
              <button type="button" class="btn btn-link text-danger p-1 ms-2" onclick="CartManager.removeFromCart(${index});" title="Remove item">
                <i class="fa fa-trash-alt"></i>
              </button>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3 pt-1 border-top">
              <div class="qty-control" style="transform: scale(0.9); transform-origin: left center;">
                <button type="button" class="qty-btn" onclick="CartManager.updateQuantity(${index}, ${item.quantity - 1});"><i class="fa fa-minus"></i></button>
                <input type="number" class="qty-input" value="${item.quantity}" readonly>
                <button type="button" class="qty-btn" onclick="CartManager.updateQuantity(${index}, ${item.quantity + 1});"><i class="fa fa-plus"></i></button>
              </div>
              <div class="text-end">
                <span class="fs-6 fw-bold" style="color: var(--primary);">${(item.price * item.quantity).toLocaleString('en-PK', {minimumFractionDigits: 2})} Rs.</span>
                <div class="text-muted small" style="font-size: 0.75rem;">(${item.price.toLocaleString()} Rs. / each)</div>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  static openCartModal() {
    CartManager.initCartModal();
    CartManager.renderCartModal();
    const modalEl = document.getElementById('cartCenterModal');
    if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  static openCartDrawer() {
    CartManager.openCartModal();
  }
}

// Wishlist State Manager
class WishlistManager {
  static getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('zaiqa_wishlist')) || [];
    } catch(e) {
      return [];
    }
  }

  static toggle(productId) {
    let list = WishlistManager.getWishlist();
    const idx = list.indexOf(productId);
    const product = PRODUCTS_DATA.find(p => p.id === productId);

    if (idx > -1) {
      list.splice(idx, 1);
      showToast(`Removed "${product ? product.name : ''}" from wishlist.`);
    } else {
      list.push(productId);
      showToast(`Added "${product ? product.name : ''}" to wishlist!`);
    }

    localStorage.setItem('zaiqa_wishlist', JSON.stringify(list));
    CartManager.updateCounters();
    return idx === -1;
  }

  static isWishlisted(productId) {
    return WishlistManager.getWishlist().includes(productId);
  }
}

// Toast Helper
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.innerHTML = `
    <i class="fa fa-check-circle" style="color: var(--primary); font-size: 1.2rem;"></i>
    <span style="font-weight: 500;">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Render Product Card HTML
function renderProductCard(product) {
  const isWish = WishlistManager.isWishlisted(product.id);
  const oldPriceHtml = product.originalPrice 
    ? `<span class="product-old-price">${product.originalPrice.toLocaleString('en-PK', {minimumFractionDigits: 2})} Rs.</span>` 
    : '';

  const badgeHtml = product.badge
    ? `<span class="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm text-white fw-bold" style="background-color: var(--secondary); font-size: 0.75rem; letter-spacing: 0.5px; z-index: 2;">${product.badge}</span>`
    : '';

  return `
    <div class="col-lg-3 col-md-6 col-12 mb-4">
      <div class="product-card shadow-sm" data-product-id="${product.id}">
        <div class="product-image-container position-relative">
          ${badgeHtml}
          <a href="product.html?slug=${product.slug}">
            <img src="${product.primaryImg}" alt="${product.name}" class="product-img-primary" loading="lazy">
            <img src="${product.secondaryImg}" alt="${product.name}" class="product-img-secondary" loading="lazy">
          </a>
        </div>
        <div class="product-info">
          <div class="d-flex align-items-center justify-content-center gap-1 mb-2 text-warning small">
            <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>
            <span class="text-muted ms-1" style="font-size: 0.78rem;">(${product.reviewsCount})</span>
          </div>
          <h3 class="product-title">
            <a href="product.html?slug=${product.slug}">${product.name}</a>
          </h3>
          <div class="product-subdesc">${product.subdesc.replace(/\n/g, '<br>')}</div>
          <div class="product-price-row">
            <span class="product-price">${product.price.toLocaleString('en-PK', {minimumFractionDigits: 2})} Rs.</span>
            ${oldPriceHtml}
          </div>
          <div class="product-action-btns">
            <button type="button" class="btn-add-cart" onclick="CartManager.addToCart(${product.id})">
              <i class="fa fa-shopping-cart"></i>
              <span>Add to Cart</span>
            </button>
            <button type="button" class="btn-icon-wishlist ${isWish ? 'active' : ''}" title="Add to wishlist" onclick="toggleWishlistBtn(this, ${product.id})">
              <i class="fa ${isWish ? 'fa-heart text-danger' : 'fa-heart-o'}"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function toggleWishlistBtn(btn, productId) {
  const added = WishlistManager.toggle(productId);
  const icon = btn.querySelector('i');
  if (added) {
    btn.classList.add('active');
    icon.className = 'fa fa-heart text-danger';
  } else {
    btn.classList.remove('active');
    icon.className = 'fa fa-heart-o';
  }
}

// Search Modal Functionality
function handleGlobalSearch(query) {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  return PRODUCTS_DATA.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.subdesc.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

// ==========================================================================
// SCROLL POP-UP & ZOOM-IN ANIMATION OBSERVER
// Elements smoothly pop up and zoom in as they enter the screen
// ==========================================================================
let scrollObserverInstance = null;

function initScrollZoomAnimations() {
  const targetSelectors = [
    '.hero-section .row > div',
    '.product-card',
    '.process-step-card',
    '.why-buy-section .bg-white',
    '.gallery-item',
    '.gallery-intro-section',
    '.products-section-header',
    '.process-section .text-center',
    '.why-buy-section .text-center',
    '.main-footer .col-lg-5',
    '.main-footer .col-lg-3',
    '.main-footer .col-lg-4',
    '.product-detail-card',
    '.page-title-parallax',
    '.checkout-stepper',
    '#step1View .bg-white',
    '#step2View .bg-white',
    '#step3View .bg-white',
    '.about-mission-box',
    '.about-concept-box',
    '.scroll-zoom-target'
  ];

  const elements = document.querySelectorAll(targetSelectors.join(', '));

  if (!('IntersectionObserver' in window)) {
    // Fallback if browser doesn't support IntersectionObserver
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  if (scrollObserverInstance) {
    scrollObserverInstance.disconnect();
  }

  scrollObserverInstance = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('revealed');
      } else {
        // When user scrolls back up and element moves below the viewport,
        // reset it so scrolling down will zoom it in again smoothly!
        const rect = entry.boundingClientRect;
        if (rect.top > window.innerHeight) {
          el.classList.remove('revealed');
        }
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach((el) => {
    if (!el.classList.contains('scroll-zoom-popup') && !el.classList.contains('scroll-zoom-in')) {
      el.classList.add('scroll-zoom-popup');
      
      // Auto assign stagger delay to siblings in grids
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => 
          c.classList.contains('col-lg-3') || 
          c.classList.contains('col-lg-4') || 
          c.classList.contains('col-md-6') || 
          c.classList.contains('col-sm-6') ||
          c.classList.contains('gallery-item')
        );
        const sibIdx = siblings.indexOf(el);
        if (sibIdx >= 0) {
          el.classList.add(`delay-${Math.min(sibIdx + 1, 6)}`);
        }
      }
    }

    // If already in top viewport on initial load, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => el.classList.add('revealed'), 80);
    }

    scrollObserverInstance.observe(el);
  });
}

// ==========================================================================
// MOBILE APP-STYLE BOTTOM NAVIGATION BAR
// Provides ultra-smooth, responsive mobile app experience
// ==========================================================================
function initMobileBottomNav() {
  if (document.querySelector('.mobile-bottom-nav')) return; // Already exists

  const currentPath = window.location.pathname.toLowerCase();
  const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
  const isShop = currentPath.includes('shop.html');
  const isWishlist = currentPath.includes('wishlist.html');
  const isCart = currentPath.includes('cart.html');

  const bottomNav = document.createElement('nav');
  bottomNav.className = 'mobile-bottom-nav';
  bottomNav.innerHTML = `
    <a href="index.html" class="mobile-bottom-nav-item ${isHome ? 'active' : ''}">
      <i class="fa fa-home"></i>
      <span>Home</span>
    </a>
    <a href="shop.html" class="mobile-bottom-nav-item ${isShop ? 'active' : ''}">
      <i class="fa fa-store"></i>
      <span>Shop</span>
    </a>
    <a href="https://WA.me/+923074156658?text=Hello%20Zaiqa%20Craft,%20I%20would%20like%20to%20order%20delicious%20snacks!" target="_blank" class="mobile-bottom-nav-item whatsapp-item" title="Order on WhatsApp">
      <i class="fab fa-whatsapp"></i>
      <span>WhatsApp</span>
    </a>
    <a href="wishlist.html" class="mobile-bottom-nav-item ${isWishlist ? 'active' : ''}">
      <i class="fa fa-heart"></i>
      <span>Wishlist</span>
      <span class="badge-counter my_wish_quantity d-none">0</span>
    </a>
    <a href="cart.html" class="mobile-bottom-nav-item ${isCart ? 'active' : ''}">
      <i class="fa fa-shopping-cart"></i>
      <span>Cart</span>
      <span class="badge-counter my_cart_quantity d-none">0</span>
    </a>
  `;

  document.body.appendChild(bottomNav);
  CartManager.updateCounters();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateCounters();
  CartManager.initCartModal();
  initMobileBottomNav();
  
  // Header and Bottom Nav cart buttons open cart modal with center zoom-in
  document.querySelectorAll('.header-cart-btn, .mobile-bottom-nav-item[href="cart.html"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!window.location.pathname.endsWith('cart.html')) {
        e.preventDefault();
        CartManager.openCartModal();
      }
    });
  });

  // Initialize scroll zoom animations after initial DOM rendering
  setTimeout(() => {
    initScrollZoomAnimations();
  }, 100);

  // Search Input listener
  const searchInputs = document.querySelectorAll('.search-query');
  searchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = input.value.trim();
        window.location.href = `shop.html?search=${encodeURIComponent(val)}`;
      }
    });
  });
});

// Re-observe dynamic products whenever product containers update
const productObserver = new MutationObserver(() => {
  initScrollZoomAnimations();
});

const featuredCont = document.getElementById('featuredProductsContainer');
if (featuredCont) {
  productObserver.observe(featuredCont, { childList: true });
}

const shopGridCont = document.getElementById('shopProductsGrid');
if (shopGridCont) {
  productObserver.observe(shopGridCont, { childList: true });
}

