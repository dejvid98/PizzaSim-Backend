const app = require('./app');
const mongoose = require('mongoose');
const DB = require('./dbConfig');

try {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful!'));
} catch (e) {
  console.log(e);
}

const port = process.env.PORT || 3005;

app.listen(port, () => console.log(`Server is running on ${port}`));
