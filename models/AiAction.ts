import mongoose, {Schema, Document, Types, models, model} from "mongoose";

export interface IAiAction extends Document{
  user: Types.ObjectId;
  note: Types.ObjectId;
  actionType: "SUMMARY" | "KEYWORDS" | "QUESTIONS";
  result: string;
  createdAt: Date;
}

const AiActionSchema = new Schema<IAiAction>({
  user: {type: Schema.Types.ObjectId, ref:"User", required: true},
  note: {type: Schema.Types.ObjectId, ref:"Note", required: true},
  actionType: {type: String, enum: ["SUMMARY", "KEYWORDS", "QUESTIONS"], required: true},
  result: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
})

const AiAction = mongoose.models?.AiAction || mongoose.model<IAiAction>("AiAction", AiActionSchema);

export default AiAction;