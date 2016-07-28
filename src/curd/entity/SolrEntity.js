var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SolrSchema = new Schema({
    image : String,
    field : String,
    rows : String,

    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : Date, default : Date.now()},
    updatetime : {type : Date, default : Date.now()}


});
var solrModel = mongoose.model("solr", SolrSchema, "solr");




