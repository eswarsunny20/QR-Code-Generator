import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import qr from 'qr-image';
import fs from 'fs';

const app = express();
const upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/generateQR', upload.none(), (req, res) => {
  const url = req.body.URL;
  fs.writeFile("URL.txt", url, err => {
    if (err) {
      console.log("Error writing file:", err);
      return res.status(500).send("Error writing file.");
    }

    const qr_svg = qr.image(url, { type: 'png' });
    const outputFileName = 'qr_img.png';
    const outputPath = './public/' + outputFileName;
    
    qr_svg.pipe(fs.createWriteStream(outputPath))
      .on('finish', () => {
        res.redirect(`/success.html?file=${outputFileName}`);
    })
      .on('error', (err) => {
        console.log("Error creating QR code:", err);
        res.status(500).send("Error creating QR code.");
      });
  });
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
  

app.use(express.static('public'));

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
