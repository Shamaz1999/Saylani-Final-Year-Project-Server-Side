var mongoose = require("mongoose")
const contactSchema = { name: String, topic: String, comments: String, date: Date}
const contact = mongoose.model('Contact',contactSchema);
module.exports = contact