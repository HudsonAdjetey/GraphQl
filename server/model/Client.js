const { Schema, model } = require("mongoose");

const clientSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  // projects: [{ type: Schema.Types.ObjectId, ref: "Project" }]
});

const ClientModel = model("client", clientSchema);

module.exports = ClientModel;
