// Admin Panel JavaScript
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'lohoba2024';

// Check if admin is logged in
function checkAdminAuth() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  if (isLoggedIn === 'true') {
    showDashboard();
  } else {
    showLogin();
  }
}

// Admin login
function adminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem('adminLoggedIn', 'true');
    showDashboard();
    loadExistingPosts();
  } else {
    alert('Invalid credentials!');
  }
}

// Logout
function logout() {
  localStorage.removeItem('adminLoggedIn');
  showLogin();
}

// Show login form
function showLogin() {
  document.getElementById('loginForm').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
  loadVisitorsData();
  loadProductsData();
  loadExistingPosts();
}

// Add new blog post to Firebase
function addBlogPost(event) {
  event.preventDefault();
  
  const title = document.getElementById('blogTitle').value;
  const image = document.getElementById('blogImage').value;
  const content = document.getElementById('blogContent').value;
  
  console.log('Adding blog post:', { title, image: image.substring(0, 50) + '...', content: content.substring(0, 50) + '...' });
  
  const post = {
    id: Date.now(),
    title: title,
    image: image,
    content: content,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
  
  // Check Firebase availability
  console.log('Firebase available:', typeof firebase !== 'undefined');
  console.log('Firestore available:', typeof firebase !== 'undefined' && firebase.firestore);
  
  // Save to Firebase first
  if (typeof firebase !== 'undefined' && firebase.firestore) {
    console.log('Attempting to save to Firebase...');
    firebase.firestore().collection('blogPosts').add(post)
      .then((docRef) => {
        console.log('✅ Firebase save successful, doc ID:', docRef.id);
        // Also save to localStorage as backup
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts.unshift(post);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        
        alert('✅ Blog post published to Firebase successfully!');
        loadExistingPosts();
      })
      .catch((error) => {
        console.error('❌ Firebase save failed:', error);
        // Fallback to localStorage only
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts.unshift(post);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        alert('⚠️ Firebase failed, post saved locally only: ' + error.message);
        loadExistingPosts();
      });
  } else {
    console.log('❌ Firebase not available, saving to localStorage only');
    // No Firebase, save to localStorage only
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts.unshift(post);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    alert('⚠️ Post saved locally only (Firebase not configured)');
    loadExistingPosts();
  }
  
  // Clear form
  document.getElementById('blogTitle').value = '';
  document.getElementById('blogImage').value = '';
  document.getElementById('blogContent').value = '';
}

// Load existing posts
function loadExistingPosts() {
  const postsList = document.getElementById('postsList');
  
  // Load from localStorage first
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  
  if (posts.length === 0) {
    postsList.innerHTML = '<p>No blog posts yet.</p>';
    return;
  }
  
  postsList.innerHTML = posts.map(post => `
    <div class="post-item">
      <img src="${post.image}" alt="${post.title}" class="post-thumb">
      <div class="post-details">
        <h4>${post.title}</h4>
        <p class="post-date">${post.date}</p>
        <p class="post-excerpt">${post.content.substring(0, 100)}...</p>
        <button onclick="deletePost(${post.id})" class="delete-btn">Delete</button>
      </div>
    </div>
  `).join('');
}

// Delete post
function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts = posts.filter(post => post.id != postId); // Use != for type flexibility
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    loadExistingPosts();
    alert('Post deleted successfully!');
  }
}

// Tab management
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const targetTab = document.getElementById(tabName + 'Tab');
  if (targetTab) {
    targetTab.classList.add('active');
  }
  
  if (event && event.target) {
    event.target.classList.add('active');
  }
  
  // Load tab data with delay to ensure DOM is ready
  setTimeout(() => {
    if (tabName === 'visitors') loadVisitorsData();
    if (tabName === 'products') loadProductsData();
    if (tabName === 'blog') loadExistingPosts();
  }, 100);
}

// Load visitors data
function loadVisitorsData() {
  const visitors = JSON.parse(localStorage.getItem('siteVisitors')) || [];
  const today = new Date().toDateString();
  const todayVisitors = visitors.filter(v => new Date(v.timestamp).toDateString() === today);
  const uniqueSessions = [...new Set(visitors.map(v => v.sessionId))];
  
  document.getElementById('totalVisitors').textContent = visitors.length;
  document.getElementById('todayVisitors').textContent = todayVisitors.length;
  document.getElementById('uniqueVisitors').textContent = uniqueSessions.length;
  
  // Recent visitors table
  const visitorsTable = document.getElementById('visitorsTable');
  if (visitors.length === 0) {
    visitorsTable.innerHTML = '<p>No visitors yet.</p>';
    return;
  }
  
  const recentVisitors = visitors.slice(-20).reverse();
  visitorsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Page</th>
          <th>Referrer</th>
          <th>Browser</th>
        </tr>
      </thead>
      <tbody>
        ${recentVisitors.map(visitor => `
          <tr>
            <td>${new Date(visitor.timestamp).toLocaleString()}</td>
            <td>${visitor.page}</td>
            <td>${visitor.referrer}</td>
            <td>${getBrowserName(visitor.userAgent)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Load products data
async function loadProductsData() {
  const productsTable = document.getElementById('productsTable');
  const totalProductsEl = document.getElementById('totalProducts');
  
  productsTable.innerHTML = '<p style="text-align: center; padding: 20px;">🔄 Loading...</p>';
  
  try {
    const products = await fetchLiveProducts();
    
    totalProductsEl.textContent = products.length;
    
    if (products.length === 0) {
      productsTable.innerHTML = '<p style="color: #ff6b6b; text-align: center; padding: 20px;">No products found. Make sure your Google Sheet is public and has data.</p>';
      return;
    }
    
    productsTable.innerHTML = `
      <table>
        <thead>
          <tr><th>Image</th><th>Name</th><th>Price</th><th>SKU</th><th>Stock</th><th>Category</th></tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><img src="${p.image || ''}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" onerror="this.style.display='none'"></td>
              <td>${p.name || 'N/A'}</td>
              <td>₦${(p.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              <td>${p.sku || 'N/A'}</td>
              <td>${p.stock || 'N/A'}</td>
              <td>${p.category || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
  } catch (error) {
    console.error('Error:', error);
    productsTable.innerHTML = `<p style="color: #ff6b6b; text-align: center; padding: 20px;">Error: ${error.message}</p>`;
  }
}

// Helper function to get browser name
function getBrowserName(userAgent) {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
}

// Fetch live products
async function fetchLiveProducts() {
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/1nQRrf2EjX90TSfzpdhHNuPMuwBiAQSyH9SFnt13EqoY/export?format=csv&gid=0';
  
  const response = await fetch(CSV_URL + '&t=' + Date.now(), { mode: 'cors' });
  
  if (!response.ok) {
    throw new Error(`Sheet not accessible (${response.status}). Make sure it's public.`);
  }
  
  const csvText = await response.text();
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length <= 1) {
    return [];
  }
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    const product = {};
    
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      if (header === 'price') {
        value = parseInt(value.replace(/[^0-9]/g, '')) || 0;
      } else if (header === 'stock') {
        value = parseInt(value) || 0;
      }
      
      product[header] = value;
    });
    
    if (product.name && product.price > 0) {
      products.push(product);
    }
  }
  
  return products;
}

let autoRefreshInterval = null;

function startAutoRefresh() {
  const btn = document.getElementById('autoRefreshBtn');
  
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    btn.textContent = '▶️ Auto Refresh';
    btn.style.background = '#2ed573';
  } else {
    autoRefreshInterval = setInterval(loadProductsData, 10000);
    btn.textContent = '⏸️ Stop Auto';
    btn.style.background = '#ff6b6b';
    loadProductsData();
  }
}

// Test Google Sheets connection
function testSheetConnection() {
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/1nQRrf2EjX90TSfzpdhHNuPMuwBiAQSyH9SFnt13EqoY/export?format=csv&gid=0';
  
  console.log('Testing CSV connection...');
  
  fetch(CSV_URL)
    .then(response => {
      console.log('✅ CSV Response Status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      console.log('✅ CSV Data received, length:', data.length);
      console.log('📄 First 300 characters:', data.substring(0, 300));
      
      const lines = data.split('\n').filter(line => line.trim());
      console.log('📊 Total rows:', lines.length);
      
      if (lines.length > 0) {
        console.log('📋 Headers:', lines[0]);
      }
      
      alert(`Sheet connection successful!\nRows: ${lines.length}\nCheck console for details.`);
    })
    .catch(error => {
      console.error('❌ CSV Connection Error:', error);
      alert(`Sheet connection failed: ${error.message}\n\nMake sure your Google Sheet is:\n1. Public (Anyone with link can view)\n2. Published to web\n3. Has the correct sheet ID`);
    });
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
  console.log('Admin panel initializing...');
  checkAdminAuth();
  
  // Force load products data after a short delay to ensure localStorage is ready
  setTimeout(() => {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      loadVisitorsData();
      loadProductsData();
    }
  }, 500);
});