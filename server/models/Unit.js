import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
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
            maxlength: 20
        }
    },
    {
        timestamps: true
    }
);

unitSchema.index(
    { userId: 1, name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;