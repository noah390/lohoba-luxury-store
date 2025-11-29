// Google Apps Script Code
// Copy this to script.google.com

function doGet() {
  const SHEET_ID = '1nQRrf2EjX90TSfzpdhHNuPMuwBiAQSyH9SFnt13EqoY';
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Try different sheet names
    let sheet = spreadsheet.getSheetByName('Lohoba Luxury');
    if (!sheet) {
      sheet = spreadsheet.getSheetByName('Sheet1');
    }
    if (!sheet) {
      sheet = spreadsheet.getSheets()[0]; // Get first sheet
    }
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({error: 'No sheet found'})).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const products = rows.map(row => {
      const product = {};
      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(/\s+/g, '');
        product[key] = row[index] || '';
      });
      return product;
    }).filter(p => p.name && p.price);
    
    return ContentService.createTextOutput(JSON.stringify(products)).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}