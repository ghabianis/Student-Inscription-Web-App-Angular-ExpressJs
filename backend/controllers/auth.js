const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  console.log("we are here",req.body)

  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userDetails = {
      name: name,
      username:username,
      email: email,
      password: hashedPassword,
    };

    console.log(userDetails)
    const result = await User.save(userDetails);

    res.status(201).json({ message: 'User registered!' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.find(email);

    if (user[0].length !== 1) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    const storedUser = user[0][0];
console.log(user[0][0].password);

bcrypt.compare(password, storedUser.password, function(err, result) {
  if (err) {  const error = new Error('Wrong password!');
  error.statusCode = 401;
  throw error; }
  const token = jwt.sign(
    {
      email: storedUser.email,
      userId: storedUser.id,
      name: storedUser.name,
      username:storedUser.username
    },
    'secretfortoken',
    { expiresIn: '1h' }
  );
  res.status(200).json({ token: token, userId: storedUser.id , email:storedUser.email,username:storedUser.username,name:storedUser.name});
 
});


}
 catch (err) {
if (!err.statusCode) {
  err.statusCode = 500;
}
    next(err);
  }
};
