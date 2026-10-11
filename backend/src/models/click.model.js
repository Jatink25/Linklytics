import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
    url: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
        required: true
    },
    clickedAt: {
        type: Date,
        default: Date.now
    }
});

export const Click = mongoose.model("Click", clickSchema);