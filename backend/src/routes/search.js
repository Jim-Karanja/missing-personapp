const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Search endpoint working' });
});

module.exports = router;

