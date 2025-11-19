import mongoose from "mongoose";

const { Schema } = mongoose;

const teamSchema = new Schema({
  teamLeader: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);
export default Team;
