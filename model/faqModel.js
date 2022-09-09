var mongoose=require('mongoose')
var schema=mongoose.Schema;
var mongoosePaginate=require('mongoose-paginate')

var faqSchema=new schema({
    title:{
        type:String
    },
    question:{
        type:String
    },
    answer:{
        type:String
    },
    status:{
        type:String,
        enum:["ACTIVE","INACTIVE"],
        default:"ACTIVE"
    },
},{timestamps:true});
faqSchema.plugin(mongoosePaginate)
module.exports=mongoose.model('faq',faqSchema);