// Libraries imports
const mongoose = require('mongoose');

// Relative imports
const app = require('./app');
const DB = require('./dbConfig');
const socket = require('./socket');

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

const port = process.env.PORT || 3033;

const server = app.listen(port, () =>
  console.log(`Server is running on ${port}`)
);

socket.init(server);
