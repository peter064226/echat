let express = require('express');
let app = express();
global.dbHelper = require( './common/dbHelper' );

var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
 
//调用中间件使用
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer());

app.use(session({
    secret:'secret',
    cookie:{
        maxAge:1000*60*30
    }
}));

app.get('/',function(req,res){
	res.locals.message = ''; 
	res.render('register');
})
app.post('/register',function(req,res){
	let User = global.dbHelper.getModel('user'),
	uname = req.body.uname;
	User.findOne({name:uname},function(error,doc){
		if(doc){
			req.session.error = 'user exist';
			res.send(500);
		}else{
			User.create({
				name:uname,
				password:req.body.upwd
			},function(error,doc){
				if(error){
					res.send(500);
				}else{
					req.session.error='user created success';
					res.send(200);
				}
			})
		}
	})
})
app.use(function(req, res, next){
    res.locals.user = req.session.user; //保存用户信息
    var err = req.session.error;  //保存结果响应信息
    res.locals.message = '';  // 保存html标签
    if (err) res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});
app.get('/login',function(req,res){
    res.render('login');
});
app.post('/login', function (req, res) {
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;
        User.findOne({name: uname}, function (error, doc) {
            if (error) {
                res.send(500);
                console.log(error);
            } else if (!doc) {
                req.session.error = '用户名不存在！';
                res.send(404);
            } else {
               if(req.body.upwd != doc.password){
                   req.session.error = "密码错误!";
                   res.send(404);
               }else{
                   req.session.user=doc;
                   res.send(200);
               }
            }
        });
    });
app.set('view engine','html');
app.engine('.html',require('ejs').__express);
app.set('views', require('path').join(__dirname, 'views'));	
app.use(express.static(require('path').join(__dirname, 'public')));

app.listen(5678);
