import mongoose from "mongoose";
import { ObjectId, ObjectID } from "bson";

const balanceHistorySchema = new mongoose.Schema({
    agentId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    balanceAdded: Number,
    date: Date
  });

  export type BalanceHistoryModel = mongoose.Document & {
    agentId: ObjectId,
    balanceAdded: Number,
    date: Date
  };

const BalanceHistory = mongoose.model("BalanceHistory", balanceHistorySchema);
export default BalanceHistory;