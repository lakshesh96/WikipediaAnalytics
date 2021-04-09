var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Asst2Data', { useNewUrlParser: true }, function () {
  console.log('mongodb connected')
});


module.exports = mongoose;
