import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request) {
    await dbConnect();

    const { username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found",
                },
                { status: 404 }
            );
            
        }

        // if user is accepting the messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages",
                },
                { status: 403 }
            );
            
        }
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.log("Error Adding Messages", error);
        return Response.json(
            {
                success: false,
                messages: "Error adding messages"

            },
            { status: 500}
        )
        
        
    }
}
