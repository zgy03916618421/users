/**
 * Created by Administrator on 15-5-11.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BookSchema = new Schema({
    isbn : String,
    packaging : String,
    price : String,
    title : String,
    author : String,
    length_style : String,
    publish_place : String,
    publisher_address : String,
    publisher_name : String,
    publisher_date : String,
    print_address : String,
    printer_address : String,
    printer_name : String,
    print_date : String,
    pagesize : String,
    images_detail : String,
    size : String,
    attachment : String,
    n_series_title : String,
    tied_series_title : String,
    issn : String,
    general_notes : String,
    parallel_title : String,
    parallel_title_lang : String,
    main_heading : String,
    yopic_sub : String,
    area_sub : String,
    year_sub : String,
    clc_sort_num : String,
    clc_sort_edition : String,
    caslc_sort_num : String,
    caslc_sort_edition : String,
    primary_responsible : String,
    book_responsible : String,
    country_code : String,
    rganization_name : String,

    //±‡¬Î–≈œ¢øÈ
    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : Date, default : Date.now()},
    updatetime : {type : Date, default : Date.now()}


});
var bookdetail = mongoose.model("bookdetail", BookSchema, "bookdetail");





