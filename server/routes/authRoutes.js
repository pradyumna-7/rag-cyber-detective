const express = require('express')
const router = express.Router()
const cors = require('cors')
// const axios = require('axios')
const {scrapeWebsite} = require('../controllers/authControllers');

router.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:5173'
    }
))


router.post('/scrape', scrapeWebsite);
module.exports = router;

