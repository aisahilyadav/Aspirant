import { z }  from "zod";

//creating an object schema 

export const signupSchema = z.object({
    username: z
    .string({required_error: "Name is required"})
        .trim()
        .min(3, {message:"Name must be at least of 3 chars."})
        .max(255, {message:"Name must not be more than 255 chars."}),

    email: z
    .string({required_error: "email is required"})
        .trim()
        .email({message:"Invalid email address"})
        .min(3, {message:"email must be at least of 3 chars."})
        .max(255, {message:"email must not be more than 255 chars."}),
   password: z
    .string({required_error: "password is required"})
       .min(8, { message: "Password must be at least 8 characters long." })
       .max(32, { message: "Password must not exceed 32 characters." })
    
});
 export const loginSchema = z.object({
       email: z
    .string({required_error: "email is required"})
        .trim()
        .email({message:"Invalid email address"})
        .min(3, {message:"email must be at least of 3 chars."})
        .max(255, {message:"email must not be more than 255 chars."}),
   password: z
    .string({required_error: "password is required"})
        .trim()
       .min(8, { message: "Password must be at least 8 characters long." })
       .max(32, { message: "Password must not exceed 32 characters." })
 })