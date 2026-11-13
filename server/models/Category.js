const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },  

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 50
        }
    },
    {
        timestamps: true
    }
);

categorySchema.index(
    { userId: 1, name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Category", categorySchema);