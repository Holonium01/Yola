var mongoose = require("mongoose");

var blogSchema =new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    created: {type: Date, default: Date.now},
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
    comment:[
        {
            type:   mongoose.Schema.Types.ObjectId,
            ref:    "comment"
        }
    ]
});
module.exports =  mongoose.model("blog", blogSchema);
