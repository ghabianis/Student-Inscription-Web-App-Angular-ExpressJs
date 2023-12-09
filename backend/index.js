const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const cors = require("cors");
const adminManagementRoutes = require('./routes/adminManagement');
const db = require('./util/database');
const errorController = require('./controllers/error');
const multer = require('multer');
const fs = require('fs');
const app = express();
const path = require('path');
const uploadFile = require("./middleware/uploads");

const ports = process.env.PORT || 3005;
global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/upload', async (req, res) => {
  try {
    console.log(req);

    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file,
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file}. ${err}`,
    });
  }
});


app.get('/files' , async(req,res)=>{
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
  
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: "http://localhost:3005" + file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
})

app.get('/download/:name' , async(req,res)=>{
    const fileName = req.params.name;
    const filePath = path.join(__dirname, '/resources/static/assets/uploads/', fileName);
    console.log(filePath)
    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
})



app.delete('/delete/:name', async (req, res) => {
  const fileName = req.params.name;
  const filePath = path.join(__dirname, '/resources/static/assets/uploads/', fileName);

  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    } else {
      res.status(200).send({
        message: "File deleted successfully.",
      });
    }
  });
});





app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*','Authorization');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS','Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Custom-Header, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use('/auth', authRoutes);

app.use('/admin', adminManagementRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));
