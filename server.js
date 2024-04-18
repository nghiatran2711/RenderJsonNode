const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

// Sample configuration
const config = {
  appName: 'Vue-Node App',
  version: '1.0.0'
};

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json());
// Enable CORS
app.use(cors({
    origin: 'http://localhost:8080' // your frontend url
}));

app.get('/config', (req, res) => {
  res.json(config);
});

app.post('/postData', (req, res) => {
    console.log('Received data:', req.body);
    
    res.json({ message: 'Data received successfully!' });
  });

// Upload route
app.post('/uploadExcel', upload.single('excelFile'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      // Save or process the sheet data as needed
      // For demonstration, we'll just send it back
      res.json(sheetData.password);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Server error.');
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
