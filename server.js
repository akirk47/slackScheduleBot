const express = require('express')
const app = express()
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('login')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
