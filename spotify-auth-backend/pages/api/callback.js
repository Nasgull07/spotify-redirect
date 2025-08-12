const axios = require("axios");

module.exports = async (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = "https://TU_NOMBRE_VERCEL.vercel.app/api/callback";

    const code = req.query.code;

    if (!code) {
        res.status(400).send("Missing code");
        return;
    }

    try {
        const response = await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(clientId + ":" + clientSecret).toString("base64"),
            },
            data: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }).toString(),
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to exchange token" });
    }
};
