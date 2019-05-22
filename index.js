require('dotenv').config()

const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors());
app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('html', es6Renderer);
app.set('view engine', 'html');
app.set('views', 'views');
app.use('/views', express.static(__dirname + '/views/'));
app.use('/js', express.static(__dirname + '/js'));


// api routes
app.use('/', require('./auth/auth.controller'));
app.use('/api', require('./api/api.controller'));

// start server
process.env.PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () =>
    console.log(`Application started on http://localhost:${process.env.PORT }`)
);
