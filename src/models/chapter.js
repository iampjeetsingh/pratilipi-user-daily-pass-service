// Chapter Model
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        chapter_id: {
            required: true,
            unique: true,
            type: String
        },
        series_id: {
            required: true,
            type: String
        },
        index: {
            type: Number,
            required: true
        },
        release_date: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chapter", userSchema);