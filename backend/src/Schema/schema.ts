import mongoose from "mongoose";

const linkSchema =  new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    }
})

const Link = mongoose.model('Link', linkSchema);

export default Link;
