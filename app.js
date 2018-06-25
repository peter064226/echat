let express = require('express');
let app = express();
app.get('/',function(req,res){
	res.render('register');
})
app.set('view engine','html');
app.engine('.html',require('ejs').__express);
app.set('views', require('path').join(__dirname, 'views'));	
app.use(express.static(require('path').join(__dirname, 'public')));

app.listen(80);
