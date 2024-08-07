const { Schema, model } = require("mongoose");

const projectSchema = new Schema({
  name: String,
  description: String,
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  // projects: [{ type: Schema.Types.ObjectId, ref: "Project" }]
});

const ProjectModel = model("project", projectSchema);

module.exports = ProjectModel;
