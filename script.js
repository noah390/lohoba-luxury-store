// YOUR WHATSAPP NUMBER
const whatsappNumber = "09050120553";

// CART FUNCTIONALITY
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartMessage('Added to cart!');
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
}

function showCartMessage(message) {
  const msg = document.createElement('div');
  msg.textContent = message;
  msg.style.cssText = 'position:fixed;top:80px;right:20px;background:#ff6b6b;color:white;padding:10px 20px;border-radius:5px;z-index:1001';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2000);
}

function toggleCart() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
  } else {
    createCartModal();
  }
  renderCartItems();
}

function createCartModal() {
  const modal = document.createElement('div');
  modal.id = 'cartModal';
  modal.className = 'cart-modal';
  modal.innerHTML = `
    <div class="cart-content">
      <div class="cart-header">
        <h3>🛒 Your Cart</h3>
        <span class="cart-close" onclick="toggleCart()">&times;</span>
      </div>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-footer">
        <div class="cart-total" id="cartTotal">Total: ₦0</div>
        <div class="cart-buttons">
          <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>
          <button class="checkout-btn" onclick="checkoutCart()">Checkout via WhatsApp</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function renderCartItems() {
  const cartItemsDiv = document.getElementById('cartItems');
  const cartTotalDiv = document.getElementById('cartTotal');
  
  if (!cartItemsDiv) return;
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    cartTotalDiv.textContent = 'Total: ₦0';
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartItemsDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</p>
        <p class="cart-item-total">${formatPrice(item.price * item.quantity)}</p>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.id}')">&times;</button>
    </div>
  `).join('');
  
  cartTotalDiv.textContent = `Total: ${formatPrice(total)}`;
}

function checkoutCart() {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  
  const items = cart.map(item => 
    `🛍️ ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
  ).join('\n');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const msg = encodeURIComponent(
    `Hello Lohoba Luxury 👋\n` +
    `I'd like to checkout my cart:\n\n` +
    `${items}\n\n` +
    `💰 Total: ${formatPrice(total)}\n\n` +
    `📝 My Details:\n` +
    `Name: \n` +
    `Phone: \n` +
    `Delivery Address: \n\n` +
    `Thank you! 🌟`
  );
  
  window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  
  // Clear cart after checkout
  if (confirm('Clear cart after checkout?')) {
    clearCart();
  }
}

function clearCart() {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartMessage('Cart cleared!');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
  showCartMessage('Item removed from cart!');
}

// GOOGLE SHEETS CSV URL - Make sure your sheet is public
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1nQRrf2EjX90TSfzpdhHNuPMuwBiAQSyH9SFnt13EqoY/export?format=csv&gid=0';

// Test CSV connection
function testCSVConnection() {
  fetch(CSV_URL)
    .then(response => {
      console.log('CSV Response Status:', response.status);
      return response.text();
    })
    .then(data => {
      console.log('CSV Data Preview:', data.substring(0, 500));
    })
    .catch(error => {
      console.error('CSV Connection Error:', error);
    });
}

// Fallback products (will be replaced by Google Sheets data)
let products = [
  {
    id: "bag-001",
    name: "Monte Carlo Tote",
    price: 250000,
    sku: "LL-MC-001",
    stock: 5,
    image: "https://images.unsplash.com/photo-1555529669-9c8b1b6d6bda?q=80",
    description: "Full-grain leather tote with gold hardware."
  },
  {
    id: "bag-002",
    name: "Savoy Evening Clutch",
    price: 180000,
    sku: "LL-SV-002",
    stock: 3,
    image: "https://images.unsplash.com/photo-1503342452485-86f7f8aa58f9?q=80",
    description: "Elegant satin-lined clutch for premium outings."
  }
];

function formatPrice(n){
  return "₦" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function buildWhatsApp(product){
  const msg = encodeURIComponent(
    `Hello Lohoba Luxury 👋\n` +
    `I'd like to order:\n\n` +
    `🛍️ Product: ${product.name}\n` +
    `🏷️ SKU: ${product.sku || 'N/A'}\n` +
    `💰 Price: ${formatPrice(product.price)}\n` +
    `📦 Quantity: 1\n\n` +
    `📝 My Details:\n` +
    `Name: \n` +
    `Phone: \n` +
    `Delivery Address: \n\n` +
    `Thank you! 🌟`
  );
  return `https://wa.me/${whatsappNumber}?text=${msg}`;
}



// Fetch products from Google Sheets CSV
async function fetchProductsFromSheet() {
  try {
    console.log('Fetching CSV from:', CSV_URL);
    const response = await fetch(CSV_URL, {
      method: 'GET',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV Response received, length:', csvText.length);
    console.log('First 200 chars:', csvText.substring(0, 200));
    
    const lines = csvText.split('\n').filter(line => line.trim());
    console.log('Total lines:', lines.length);
    
    if (lines.length > 1) {
      // Parse CSV properly handling quoted values
      const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };
      
      const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase());
      console.log('Headers found:', headers);
      
      const products = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const product = {};
        
        headers.forEach((header, index) => {
          let value = values[index] || '';
          value = value.replace(/"/g, '').trim();
          
          if (header === 'price') {
            value = parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
          } else if (header === 'stock') {
            value = parseInt(value) || 0;
          }
          
          product[header] = value;
        });
        
        if (product.name && product.price) {
          products.push(product);
        }
      }
      
      console.log('Parsed products:', products.length, products);
      return products;
    }
  } catch (error) {
    console.error('Error fetching CSV:', error);
    console.log('CSV URL might be blocked or sheet not public');
  }
  
  console.log('Using fallback products');
  return products;
}

function showLoading() {
  const box = document.getElementById("products");
  box.innerHTML = '<div class="loading">Loading luxury products...</div>';
}

function showError() {
  const box = document.getElementById("products");
  box.innerHTML = '<div class="error">Unable to load products. Please try again later.</div>';
}

function renderProducts(productList = products){
  const box = document.getElementById("products");
  
  if (!productList || productList.length === 0) {
    box.innerHTML = '<div class="error">No products available at the moment.</div>';
    return;
  }

  box.innerHTML = "";

  productList.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb" style="background-image:url('${p.image}')" onclick="showProductDetails(${JSON.stringify(p).replace(/"/g, '&quot;')})"></div>
      <div class="title">${p.name}</div>
      <div class="price">${formatPrice(p.price)}</div>
      <div class="btn-group">
        <button class="cart-btn" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">Add to Cart</button>
        <button class="details-btn" onclick="showProductDetails(${JSON.stringify(p).replace(/"/g, '&quot;')})">View Details</button>
        <a href="${buildWhatsApp(p)}" target="_blank" class="whatsapp-btn">Buy Now</a>
      </div>
    `;
    box.appendChild(card);
  });
}

// Initialize the app
async function initApp() {
  showLoading();
  
  try {
    const fetchedProducts = await fetchProductsFromSheet();
    
    if (fetchedProducts && fetchedProducts.length > 0) {
      products = fetchedProducts;
      allProducts = [...products];
      
      // Store products for admin panel
      localStorage.setItem('allProducts', JSON.stringify(products));
      localStorage.setItem('products', JSON.stringify(products));
      window.products = products;
      
      console.log('✅ Products loaded from sheet:', products.length);
      renderProducts(products);
    } else {
      console.log('⚠️ No products from sheet, using fallback');
      allProducts = [...products];
      localStorage.setItem('allProducts', JSON.stringify(products));
      localStorage.setItem('products', JSON.stringify(products));
      window.products = products;
      renderProducts(products);
    }
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    showError();
  }
}

// Navigation functionality
function setActiveNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNav);

// Image Slider Functionality
let currentSlideIndex = 0;
let slides = [];
let dots = [];
let sliderInterval;

function initSlider() {
  slides = document.querySelectorAll('.slide');
  dots = document.querySelectorAll('.dot');
  
  if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();
  }
}

function showSlide(index) {
  if (!slides.length) return;
  
  const slider = document.querySelector('.slider-container');
  if (!slider) return;
  
  currentSlideIndex = (index + slides.length) % slides.length;
  slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  
  // Update dots if they exist
  if (dots.length > 0) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlideIndex);
    });
  }
}

function changeSlide(direction) {
  if (slides.length > 0) {
    showSlide(currentSlideIndex + direction);
  }
}

function currentSlide(index) {
  if (slides.length > 0) {
    showSlide(index - 1);
  }
}

// Auto-slide functionality
function startAutoSlide() {
  if (slides.length > 1) {
    sliderInterval = setInterval(() => {
      changeSlide(1);
    }, 5000); // Change slide every 5 seconds
  }
}

function stopAutoSlide() {
  if (sliderInterval) {
    clearInterval(sliderInterval);
  }
}

// Product Details Modal
function showProductDetails(product) {
  const modal = document.getElementById('productModal') || createProductModal();
  const modalContent = document.getElementById('productModalContent');
  
  modalContent.innerHTML = `
    <div class="product-details">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <p class="product-sku">SKU: ${product.sku || 'N/A'}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <p class="product-stock">Stock: ${product.stock || 'Available'}</p>
        <p class="product-description">${product.description || 'No description available.'}</p>
        <div class="product-actions">
          <button class="cart-btn" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')}); closeProductModal();">Add to Cart</button>
          <a href="${buildWhatsApp(product)}" target="_blank" class="whatsapp-btn">Buy on WhatsApp</a>
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
}

function createProductModal() {
  const modal = document.createElement('div');
  modal.id = 'productModal';
  modal.className = 'product-modal';
  modal.innerHTML = `
    <div class="product-modal-content">
      <span class="product-close" onclick="closeProductModal()">&times;</span>
      <div id="productModalContent"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Search and Filter Functionality
let allProducts = [];
let currentCategory = 'all';

function searchProducts() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  filterAndDisplayProducts(searchTerm, currentCategory);
}

function filterByCategory(category) {
  currentCategory = category;
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  filterAndDisplayProducts(searchTerm, category);
}

function filterAndDisplayProducts(searchTerm, category) {
  let filteredProducts = allProducts;
  
  // Filter by category
  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.category && product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by search term
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      (product.description && product.description.toLowerCase().includes(searchTerm))
    );
  }
  
  renderProducts(filteredProducts);
}

// Blog functionality
function loadBlogPosts() {
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  const blogGrid = document.getElementById('blogGrid');
  const defaultPosts = document.getElementById('defaultPosts');
  const featuredContent = document.getElementById('featuredContent');
  
  if (posts.length > 0) {
    // Hide default posts
    if (defaultPosts) defaultPosts.style.display = 'none';
    
    // Show featured post (latest)
    if (featuredContent && posts[0]) {
      featuredContent.innerHTML = `
        <div class="featured-article">
          <div class="featured-image" style="background-image: url('${posts[0].image}')"></div>
          <div class="featured-text">
            <h3>${posts[0].title}</h3>
            <p class="blog-date">${posts[0].date}</p>
            <p>${posts[0].content}</p>
          </div>
        </div>
      `;
    }
    
    // Show all posts in grid
    if (blogGrid) {
      blogGrid.innerHTML = posts.map(post => `
        <article class="blog-post">
          <div class="blog-image" style="background-image: url('${post.image}')"></div>
          <div class="blog-content">
            <h3>${post.title}</h3>
            <p class="blog-date">${post.date}</p>
            <p>${post.content.substring(0, 150)}...</p>
            <a href="#" class="read-more">Read More</a>
          </div>
        </article>
      `).join('');
    }
  } else {
    // Show default posts
    if (defaultPosts) defaultPosts.style.display = 'grid';
    if (featuredContent) featuredContent.innerHTML = '<p>No featured posts yet.</p>';
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('productModal');
  if (event.target === modal) {
    closeProductModal();
  }
}

// Visitor tracking
function trackVisitor() {
  const visitor = {
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'Direct',
    sessionId: getSessionId()
  };
  
  let visitors = JSON.parse(localStorage.getItem('siteVisitors')) || [];
  visitors.push(visitor);
  
  // Keep only last 1000 visitors
  if (visitors.length > 1000) {
    visitors = visitors.slice(-1000);
  }
  
  localStorage.setItem('siteVisitors', JSON.stringify(visitors));
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', () => {
  trackVisitor();
  initApp();
  updateCartCount();
  setActiveNav();
  initSlider();
  loadBlogPosts();
});
