import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  image: string;
  password: string;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default:
        'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model<IUser>('User', userSchema);

export default User;
