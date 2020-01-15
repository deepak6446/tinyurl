const Mongoose = require("mongoose");
const db = require("../config/connectMongoose.js");

const urlMetaSchema = new Mongoose.Schema({
  shortUrl: { type: String, required: true, unique: true},
  longUrl: { type: String, required: true }
},
{ 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

urlMetaSchema.index({ "shortUrl": 1 });
const urlMeta = db.model("category", urlMetaSchema);

module.exports = urlMeta;
