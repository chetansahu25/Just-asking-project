import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedusername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedusername });

        if (!user) {
            return Response.json(
                {
                    seccess: false,
                    message: "User not found",
                },
                { status: 500 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account verified Successfully",
            });
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Verification Code has expired please signup again to get a new code",
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "incorrect verification code",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json(
            {
                seccess: false,
                message: "Error verifying user",
            },
            { status: 500 }
        );
    }
}
