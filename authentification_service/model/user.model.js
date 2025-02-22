import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      required: [true, "Username is required!"],
      type: String,
      unique: [true, "Username is already taken"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email is already unique"],
      validate: () => {
        return true;
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    access: {
      type: Number,
      // Access Level admin: 1111, student:1121, tutor: 1122
      enum: [1111, 1121, 1122],
      required: [true, "User access control limit is required"],
      default: 1121,
      // Default access level is student
    },
    reset_password_token: {
      type: String,
      default: "",
    },
    reset_password_time: {
      type: Date,
    },
    /**
     * @
     */
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

// Check
//  Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// hash resetToken
userSchema.methods.hashToken = async function (token) {
  return await bcrypt.hash(token, 10);
};

// compare token
userSchema.methods.compareToken = async function (token) {
  return await bcrypt.compare(token, this.reset_password_token);
};

export default mongoose.model("user-v1", userSchema);
