const express = require('express')
const router = express.Router()
const cors = require('cors')
// const axios = require('axios')
const {scrapeWebsite, registerUser, loginUser, verified} = require('../controllers/authControllers');

router.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:5173'
    }
))


router.post('/scrape', scrapeWebsite);
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/verify/:id', verified)

module.exports = router;

