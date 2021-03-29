const multer = require('multer')
const path = require('path')


function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb("Error: Images Only !!!");
    }
  }
module.exports = {
    upload: () => {
        // setup multer
        var storage = multer.diskStorage({
            destination: path.join(path.resolve('public'), 'images'),
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
                // bayangan rename file => 'IMG-123456.jpg'
            }
        })

        return multer({ storage: storage,fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
          } }).single('IMG')
    }
}