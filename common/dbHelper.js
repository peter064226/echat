var mongoose=require('mongoose'),
	Schema = mongoose.Schema,
	models = require('./models');
global.db = mongoose.connect("mongodb://127.0.0.1:32768/test1");

for(var m in models){
	mongoose.model(m,new Schema(models[m]));
}
module.exports = {
	getModel:function (type) {
		// body...
		return _getModel(type);
	}
}

var _getModel = function(type){
	return mongoose.model(type);
}