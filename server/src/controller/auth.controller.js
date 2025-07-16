import {User} from "../model/user.model.js"
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const home = async (req,res) => {
    try {
        res
        .status(200)
        .send("home !");
    } catch (error) {
        console.log(error);
        
    }
}

export const signup = async (req,res) => {
    try {
        console.log(req.body);
        const {username, email, password} = req.body;
        const userExist = await User.findOne({email:email});

        if (userExist) {
            return res
            .status(401)
            .json({msg:"email already exist!!!"});
        }

        const userCreated = await User.create({
            username,
            email,
            password,
        });
        
        res
        .status(201)
         .json({
        message: "user registered!!!", 
        token: await userCreated.generateToken(),
        userId: userCreated._id.toString(),
    });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userExist = await User.findOne({email})
        console.log(userExist);

        if (!userExist) {
            return res.status(400).json({message:"Invalid Credentials"});
        }

           if (userExist.authProvider === 'google') {
            return res.status(400).json({
                message: "This account uses Google Sign-In. Please use Google to login."
            });
        }
        const isPasswordValid = await userExist.comparePassword(password)
        
        if (isPasswordValid) {
            return res
            .status(201)
              .json({
        message: "login successfull ", 
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
    });
        }
        else{
            return res.status(400).json({message:"Invalid Credentials"});
        }
        

    } catch (error) {
        console.log(error);
        return res.status(500).json("internel server error");
        
    }
}

export const googleAuth = async (req, res) => {
    try {
        const { googleToken, email, name, picture } = req.body;

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const verifiedEmail = payload['email'];
        const verifiedName = payload['name'];
        const verifiedPicture = payload['picture'];

        // Double-check that the email matches
        if (verifiedEmail !== email) {
            return res.status(400).json({
                message: "Token verification failed: email mismatch"
            });
        }

        // Check if user already exists
        let user = await User.findOne({ 
            $or: [
                { email: verifiedEmail },
                { googleId: googleId }
            ]
        });

        if (user) {
            // User exists - update Google info if needed
            if (!user.googleId) {
                // User has local account, link with Google
                user.googleId = googleId;
                user.profilePicture = verifiedPicture;
                user.authProvider = 'google';
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                username: verifiedName || name,
                email: verifiedEmail,
                googleId: googleId,
                profilePicture: verifiedPicture || picture,
                authProvider: 'google',
                // No password for Google users
            });
        }

        // Generate JWT token
        const token = await user.generateToken();

        return res.status(200).json({
            message: "Google authentication successful",
            token: token,
            userId: user._id.toString(),
            user: {
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        
        if (error.message.includes('Token used too early')) {
            return res.status(400).json({
                message: "Token is not yet valid. Please try again."
            });
        }
        
        if (error.message.includes('Token verification failed')) {
            return res.status(400).json({
                message: "Invalid Google token"
            });
        }

        return res.status(500).json({
            message: "Google authentication failed",
            error: error.message
        });
    }
};
export const  user = async (req, res) => {
    try {
       const userData = req.user;
       console.log(userData);
      return  res.status(200).json({ userData});
        
    } catch (error) {
        console.log("error from the user route" );
        
    }
}