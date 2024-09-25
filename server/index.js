const express = require('express')
// const dotenv = require('dotenv').config()
const cors = require('cors')
const app = express();

// mongoose.connect(process.env.MONGO_URL)
// .then(() => console.log('connected to mongodb'))
// .catch((err) => console.log(err))

//middleware
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
//routes
app.use('/', require('./routes/authRoutes'))

const port = 8000;
app.listen(port, () => console.log(`listening on port ${port}`))




