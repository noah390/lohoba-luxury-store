# Lohoba Luxury - Simple Setup

## ✅ **What You Get:**

- ✔️ Google Sheets integration (no API keys)
- ✔️ Built-in admin panel
- ✔️ WhatsApp checkout
- ✔️ Dynamic product loading
- ✔️ Professional luxury website
- ✔️ Blog management system

## 🚀 **3-Step Setup:**

### Step 1: Google Sheet Setup
1. Create new Google Sheet: "Lohoba Luxury Products"
2. Add sheet tab: "Products" 
3. Add these column headers:
   ```
   id | name | price | sku | stock | image | description | category
   ```
4. Share → "Anyone with link" → "Viewer"
5. Copy Sheet ID from URL: `docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

### Step 2: Update Website
1. Open `script.js`
2. Replace CSV_URL with your published sheet URL

### Step 3: Admin Panel
1. Go to `admin.html`
2. Login: **admin** / **lohoba2024**
3. Manage blog posts and content

## 📱 **Admin Features:**
- Add/edit blog posts
- Upload images
- Manage content
- Secure login system

## 🌐 **Deploy Website:**
- **Netlify**: Drag & drop your folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Push to repository

## 📊 **Sample Products (Copy to Sheet):**
```
bag-001,Monte Carlo Tote,250000,LL-MC-001,5,https://images.unsplash.com/photo-1555529669-9c8b1b6d6bda?q=80,Full-grain leather tote,bags
cloth-001,Silk Dress,180000,LL-SD-001,3,https://images.unsplash.com/photo-1503342452485-86f7f8aa58f9?q=80,Elegant silk dress,clothing
```

**Your luxury e-commerce site is ready! 🌟**