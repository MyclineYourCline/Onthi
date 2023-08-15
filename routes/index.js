var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var multer = require('multer');
const path = require('path');


/* GET home page. */
/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const Car = mongoose.model("Car", CarSamche, "Car");
    const data = await Car.find({});

    // // Xử lý dữ liệu linkAnh trước khi truyền vào EJS
    const processedData = data.map(item => {
      const processedLinks = item.linkAnh.map(link => "/uploads/" + path.basename(link));
      return { ...item, linkAnh: processedLinks };
    });

    res.render('index', { title: "List", Data: processedData });
  } catch (err) {
    res.status(500).send("Loi may chu");
  }
});

//
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname + '-' + Date.now());
  },
});
const CarSamche = new mongoose.Schema({
  name: String,
  gia: String,
  linkAnh:[String],
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 200000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg') {
      return cb(new Error('Only PNG images are allowed'));
    }
    cb(null, true);
  },
});
router.use(express.static(path.join(__dirname, 'public')));
//
main().catch(err => console.log(err));
router.get('/add', function (req,res, next){
  res.render('add',{title:"add"})
})

async function main() {
  await mongoose.connect('mongodb+srv://cachung:cachunglsq2002@cachung.mnoktxe.mongodb.net/ThuThu');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
router.post("/upCar",upload.array('anh',2),async function (req,res,next){
  const  files = req.files
  const tempFilePaths = files.map(file => file.path);
  let CarM = mongoose.model('Car', CarSamche,'Car');
  await CarM.create({
    name: req.body.ten,
    gia: req.body.gia,
    linkAnh: tempFilePaths
  })
  res.redirect('/')
})
module.exports = router;
