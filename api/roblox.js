export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    try {

        const body = req.body;

        const username = body.username;


        if (!username) {

            return res.status(400).json({
                error: "No username provided"
            });

        }



        // Find Roblox user ID
        const userResponse = await fetch(
            "https://users.roblox.com/v1/usernames/users",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    usernames: [
                        username
                    ],

                    excludeBannedUsers: true
                })
            }
        );



        const userData = await userResponse.json();



        if (
            !userData.data ||
            userData.data.length === 0
        ) {

            return res.status(404).json({
                error: "Roblox user not found"
            });

        }



        const user = userData.data[0];





        // Get avatar image
        const avatarResponse = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png`
        );



        const avatarData = await avatarResponse.json();



        let avatar = null;


        if (
            avatarData.data &&
            avatarData.data.length > 0
        ) {

            avatar = avatarData.data[0].imageUrl;

        }





        // Send data back to website
        return res.status(200).json({

            success:true,

            id:user.id,

            username:user.name,

            avatar:avatar

        });



    } catch(error) {


        console.error(error);


        return res.status(500).json({

            error:"Roblox API error"

        });


    }

}
