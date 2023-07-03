const express = require('express');
const router = express.Router();
const userCtrl = require ('../controllers/user');
const rateLimit = require('express-rate-limit');

const limiter2 = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50
  })

  
router.post('/signup', limiter2, userCtrl.signup);
router.post('/login', limiter2, userCtrl.login);

module.exports = router;