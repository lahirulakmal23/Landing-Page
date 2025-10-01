import mongoose from "mongoose";

const SequenceSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true }, // e.g., "counterSeq"
    value: { type: Number, default: 0 },                  // global people counter
    counters: { type: Number, default: 3, min: 1 }        // total counters (N)
  },
  { timestamps: true }
);

const Sequence = mongoose.model("Sequence", SequenceSchema);
export default Sequence;
