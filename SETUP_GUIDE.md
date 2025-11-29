# Lohoba Luxury - Setup Guide

## 🚀 Google Sheets Integration Setup

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Lohoba Luxury Products"
3. Create a sheet tab named "Products"
4. Set up columns with these exact headers:

| id | name | price | sku | stock | image | description | category |
|----|------|-------|-----|-------|-------|-------------|----------|
| bag-001 | Monte Carlo Tote | 250000 | LL-MC-001 | 5 | https://images.unsplash.com/photo-1555529669-9c8b1b6d6bda?q=80 | Full-grain leather tote | bags |

### Step 2: Make Your Sheet Public

1. In your Google Sheet, click "Share" (top right)
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

### Step 3: Update Your Website

1. Open `script.js`
2. Replace the CSV_URL with your sheet's published CSV URL

## 🎨 Product Categories

Use these exact category values:
- `clothing` - for dresses, shirts, pants
- `bags` - for handbags, purses, totes
- `jewelry` - for necklaces, bracelets, rings
- `shoes` - for heels, sneakers, boots
- `gadgets` - for tech accessories

## 📊 Google Sheet Template

```
id,name,price,sku,stock,image,description,category
bag-001,Monte Carlo Tote,250000,LL-MC-001,5,https://images.unsplash.com/photo-1555529669-9c8b1b6d6bda?q=80,Full-grain leather tote,bags
cloth-001,Silk Dress,180000,LL-SD-001,3,https://images.unsplash.com/photo-1503342452485-86f7f8aa58f9?q=80,Elegant silk dress,clothing
```

## 🔧 Admin Panel

Use the built-in admin panel at `admin.html`:
- **Username**: admin
- **Password**: lohoba2024
- Manage blog posts directly from the website

## 🚀 Going Live

### Hosting Options:
1. **Netlify** (Free) - Drag & drop deployment
2. **Vercel** (Free) - GitHub integration
3. **GitHub Pages** (Free) - Direct from repository

Your luxury e-commerce site is ready! 🌟