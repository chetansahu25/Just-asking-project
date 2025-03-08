import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object(
    {
        username: usernameValidation
    }
)

export async function GET(request: Request){
    
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username:searchParams.get('username')
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                sucsess: false,
                message: usernameErrors?.length>0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            }, {status: 400}
        )
            
        }
        const {username } = result.data
        const existingVerifiedUser = await  UserModel.findOne({username, isVerified: true})
        if (existingVerifiedUser) {
            return Response.json({
                sucsess: false,
                message: "Username is Already Taken"
            }, {status: 400})
         
        }
        return Response.json({
            sucsess: true,
            message: "Username is available"
        }, {status: 400})
        


    } catch (error) {
        console.error("Error Checking username", error)
        return Response.json(
            {
                seccess:false,
                message: "Error checking message",

            },
            {status: 500}
        )
        
    }
}