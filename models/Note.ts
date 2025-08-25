import mongoose, {Schema, Document, Types, models, model} from "mongoose";

export interface INote extends Document{
  user: Types.ObjectId;
  title: string;
  content: string;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteScheme = new Schema<INote>({
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  aiSummary: {type: String},
}, {timestamps: true})

const Note = models?.Note || model<INote>("Note", NoteScheme);

export default Note;