import { Schema } from "zod";

const validate = (Schema ) => async (req, res, next) => {
    try {
        const parseBody = await Schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (err) {
        const status = 422;
        const message = "Fill the details properly!"
        const extraDetails= err.errors[0].message;
        const error = {
            status,
            message,
            extraDetails,
        };
        console.log(error);
        
        //res.status(400).json({msg: "validation failed"});
        next(error);
    }
};

export default validate;