export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { username } = req.body;

        const response = await fetch(
            "https://users.roblox.com/v1/usernames/users",
            {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    usernames:[username]
                })
            }
        );


        const data = await response.json();


        if (!data.data || data.data.length === 0) {
            return res.status(404).json({
                error:"User not found"
            });
        }


        const user = data.data[0];


        const avatar = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png`
        );


        const avatarData = await avatar.json();


        res.status(200).json({

            id:user.id,

            username:user.name,

            avatar:avatarData.data[0].imageUrl

        });


    } catch(err){

        res.status(500).json({
            error:err.message
        });

    }

}
