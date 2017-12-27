const express = require('express');
const path = require('path');

const publicpath = path.join(__dirname,'../public');

var app = express();

app.use(express.static(publicpath));
app.listen(3000);
