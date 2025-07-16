import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username:{
    type: String,
    required: true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required: function() {
            // Password is only required if googleId is not present
            return !this.googleId;
        },
    },
    googleId: {
        type: String,
        sparse: true, // Allows null values but ensures uniqueness when present
    },
    profilePicture: {
        type: String,
        default: null,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
},{timestamps: true});

// Create compound index for email uniqueness
userSchema.index({ email: 1 }, { unique: true });

//?secure the password using the bcrypt method
userSchema.pre("save", async function (next){

    const user = this;

    // Only hash password if it exists and is modified
    if(!user.password || !user.isModified("password")){
        return next();
    }
    
    try {
        const saltRound = await bcrypt.genSalt(5);
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
        next();
    } catch (error) {
        next(error)
    }
});


//compare the password
userSchema.methods.comparePassword = async function (password) {
    if (!this.password) {
        return false; // No password set (Google user)
    }
    return bcrypt.compare(password, this.password);    
}



//json web token
  userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                isAdmin: this.isAdmin,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        );
    } catch (error) {
        console.log(error);
        
    }
  };


//define the model or the collection name
export const User =  new mongoose.model("user", userSchema);
