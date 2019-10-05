var mongoose = require("mongoose");

commentSchema = new mongoose.Schema(
    {
        text: String,
        created: {type: Date, default: Date.now},
        name:
            {
                id:
                    {
                        type:   mongoose.Schema.Types.ObjectId,
                        ref:    "User"
                    },
                username: String
            }
    }
);
module.exports = mongoose.model("comment", commentSchema);