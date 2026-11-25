
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        FullName: {
            type: String,
            required: true,
            trim: true
        },

        emailAddress: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["Admin", "user"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("user", userSchema);
