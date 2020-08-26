const adminModel = require('../models/AdminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doesExist = await adminModel.findOne({ email });

    if (doesExist)
      return res.status(400).json({ error: 'User already exists!' });

    const admin = new adminModel({ email, password });
    const salt = await bcrypt.genSalt(4);
    admin.password = await bcrypt.hash(password, salt);
    await admin.save();
    const payload = { id: admin.id, email: admin.email };

    jwt.sign(payload, 'secretToken', (err, token) => {
      if (err) res.json({ err });
      res.json({ token });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminInfo = await adminModel.findOne({ email }).lean();

    if (!adminInfo) return res.status(400).json({ error: 'User not found!' });

    bcrypt.compare(password, adminInfo.password, (error, result) => {
      if (result) {
        delete adminInfo.password;

        jwt.sign({ adminInfo }, 'secretToken', (err, token) => {
          if (err) res.json({ err });
          res.json({ token });
        });
      } else {
        return res.json({ error });
      }
    });
  } catch (err) {
    res.send({ err });
  }
};
