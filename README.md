# Zaiqa Craft Website Clone

Yeh website **https://zaiqacraft.odoo.com/** ka 100% exact replica hai, jisme bilkul same color scheme, fonts, features, layout aur real assets shamil hain.

---

## 🎨 Color Scheme (Bilkul Same as Odoo Site)
- **Primary Color:** `#E17726` (Warm Zaiqa Amber / Orange)
- **Secondary Color:** `#51344D` (Regal Eggplant / Deep Plum)
- **Cream / Background:** `#f5f2f0`
- **White Background:** `#FFFFFF`
- **Deep Espresso Brown:** `#2e1f14`
- **Dark Text:** `#212529`

---

## 🚀 Pages & Features Included:
1. **Home (`index.html`)**:
   - Header with Logo, live search modal, Cart counter badge, Wishlist counter badge, and responsive mobile offcanvas menu.
   - Hero section with exact background, floating snack bowl image, text (*"Well come to Zaiqa Craft"*), and "Shop Now" button.
   - Featured products grid with hover image switch (Primary & Secondary image effect).
   - "Our process in three easy steps" cards (1. Add to cart, 2. Pay, 3. Get Delivered).
   - "Why Buy From Us ?" section with 4 original post-it reminder graphics.
   - "Our Products" title and 3-column masonry gallery with hover zoom.
   - 3-column footer with About us, Useful Links, and Contact info.
   - Floating WhatsApp button linking directly to `+923074156658`.

2. **Shop (`shop.html`)**:
   - "All products" title with "Snacks" filter pills.
   - Live search box with instant filtering.
   - Sort By dropdown (Featured, Newest Arrivals, Name A-Z, Price Low to High, Price High to Low).
   - Sidebar filters: Weight (250g, 500g, 1kg, 499) and Price range slider (Rs. 250 - Rs. 1000).

3. **Product Detail (`product.html`)**:
   - High-resolution image gallery with thumbnail selector.
   - Product title, star rating, price, and strike-through original price.
   - Weight variant selection with live price calculation (e.g., 250g, 500g, 1kg).
   - Quantity selector (`-` and `+`).
   - "Add to Cart" and "Order via WhatsApp" button with pre-filled order text.
   - Tabs: Description, Customer Reviews, Shipping & Delivery.
   - Related products carousel.

4. **Cart & 3-Step Checkout (`cart.html`)**:
   - Step 1: Order Review (Cart table, quantity adjustment, remove item, subtotal, discount promo code e.g. `ZAIQA10`).
   - Step 2: Shipping address form (Customer name, WhatsApp number, address, city, province).
   - Step 3: Payment method (Cash on Delivery or Bank / JazzCash / EasyPaisa transfer).
   - Instant Order confirmation with order ID and 1-click WhatsApp order confirmation.

5. **Wishlist (`wishlist.html`)**:
   - Saved items table, stock status, move-to-cart, and remove buttons.

6. **About Us (`about-us.html`)**:
   - Parallax banner.
   - "Our Mission" card with original imagery.
   - "The Organic Concept" section with original imagery.

7. **Contact Us (`contactus.html`)**:
   - Parallax banner.
   - Interactive contact inquiry form.
   - Company address, phone, email, and social media handles.

8. **Privacy Policy (`privacy.html`)**:
   - Parallax banner.
   - Interactive FAQ accordion ("How can I contact customer support?", "What is your return policy?").

---

## 💻 How to Run:

### Option 1: Double-click
Kisi bhi page (e.g. `index.html`) par double-click karke direct browser me open karein.

### Option 2: Node.js Server
Terminal me run karein:
```bash
npm start
```
Browser me open karein: `http://localhost:3000`

### Option 3: Python Server
```bash
python -m http.server 3000
```
Browser me open karein: `http://localhost:3000`
