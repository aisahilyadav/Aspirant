import {User} from "../model/user.model.js"

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
export const  user = async (req, res) => {
    try {
       const userData = req.user;
       console.log(userData);
      return  res.status(200).json({ userData});
        
    } catch (error) {
        console.log("error from the user route" );
        
    }
}