const mongoose = require("mongoose");
mongoose.connect("Mongo URL", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
}).then(console.log("MongoDB bağlandı!")).catch(err => console.log(err))
require("./BOTS/Database/index.js");
require("./BOTS/Guard 1/index.js")
require("./BOTS/Guard 2/index.js")
require("./BOTS/Guard 3/index.js")
require("./BOTS/Invite/index.js")
require("./BOTS/Moderation/index.js")
require("./BOTS/Async/index.js")
require("./BOTS/Chat Guard/index.js")
