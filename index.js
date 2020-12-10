const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const dbConnect = require('./util/database')

const app = express()
const port = process.env.PORT || 8000

//import routes
const userRoute = require('./routes/users')
const bookRoute = require('./routes/books')

//global middilewares
app.use(cors())
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.json({extended : false}))

//route middilwares
app.use('/api/users',userRoute);
app.use('/api/books',bookRoute);



app.get('/', (req,res) => {
    res.status(200).send('welcome to library management system!')
})

dbConnect( client => {
    //console.log(client)
    app.listen(port)
})

