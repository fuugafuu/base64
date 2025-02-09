const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const port = 3000;

// Multer 設定：アップロード先ディレクトリ
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));  // publicフォルダ内のファイルを静的に提供
app.use(express.json());

// ファイルアップロードのエンドポイント
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('ファイルがアップロードされていません');
    }

    // アップロードされたファイルのURLを生成
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('File uploaded successfully:', fileUrl); // デバッグ用

    // QRコードを生成
    const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

    // アップロード完了のレスポンス
    res.json({ fileUrl, qrCodeDataUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('サーバーでエラーが発生しました');
  }
});

// uploadsフォルダを静的ファイルとして提供
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
