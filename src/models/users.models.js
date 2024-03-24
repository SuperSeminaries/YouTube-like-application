import mongoose from "mongoose"
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profile: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      avatar: {
        type: String,
        default: ""
      },
      bio: String,
      country: String,
      gender: {
        type: String,
        enum: ['male', 'female', 'other'] 
      },    
    },
    referenceToken: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  });


  // Hash password before saving
  userSchema.pre("save", async function ( next ) {
    if (!this.isModified("password")) return next();

    try {
      this.password = await hash(this.password, 12)
    } catch (error) {
      console.log("message", error);
    }

  })

  // Method to compare passwords
  userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  
  userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE,})
  }


  userSchema.methods.generateReferenceToken = async function () {
    return jwt.sign({ _id: this._id }, process.env.REFERENCE_TOKEN_SECRET,
      { expiresIn: process.env.REFERENCE_TOKEN_EXPIRE,})
  }


  export const User = mongoose.model("User", userSchema)