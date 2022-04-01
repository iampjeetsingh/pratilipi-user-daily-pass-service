// User Model
const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        encry_password: {
            type: String,
            required: true,
        },
        salt: {
            type: String
        },
        role: {
            type: Number,
            default: 0,
        },
        daily_pass_info: {
            type: Object,
            default: {}
        }
    },
    { timestamps: true }
);

userSchema
    .virtual("password")
    .set(function (password) {
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })

userSchema.methods = {
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password;
    },
    securePassword: function (plainPassword) {
        if (!plainPassword) return "";
        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },
};

module.exports = mongoose.model("User", userSchema);