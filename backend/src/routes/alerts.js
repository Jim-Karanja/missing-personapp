const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Alerts endpoint working' });
});

module.exports = router;

