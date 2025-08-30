import mongoose, { models, model, Schema } from "mongoose";
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image?: string;
  provider:string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  image: { type: String },
  provider:{type:String},
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next();
});

const User = models?.User || model<IUser>("User", UserSchema)

export default User