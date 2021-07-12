const mongoose = require("mongoose");

const vallens_guard = mongoose.Schema({
    banlı: Array,
    owner: Array,
    bot: Array
});

module.exports = mongoose.model("Vallens Guard", vallens_guard);
