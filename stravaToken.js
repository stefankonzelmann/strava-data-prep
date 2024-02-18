import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

export async function generateNewToken() {
  console.log("Generating new token...");
  const requestOptions = {
    method: "POST",
    redirect: "follow",
  };
  const requestURL = `https://www.strava.com/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=ReplaceWithRefreshToken&refresh_token=${process.env.STRAVA_CACHED_REFRESH_TOKEN}`;

  try {
    let response = await fetch(requestURL, requestOptions);
    response = await response.json();
    if (response.message === "Bad Request") {
      console.log(response);
      return;
    }
    return {
      refreshToken: await response.refresh_token,
      expirationTime: await response.expires_at,
      accessToken: await response.access_token,
    };
  } catch (error) {
    console.log(error);
  }
}
