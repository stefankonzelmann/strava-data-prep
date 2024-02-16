import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

function isTokenExpired(currentExpirationTime) {
  return Date.now() > currentExpirationTime * 1000;
}

async function generateNewToken() {
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

async function persistNewTokenData(newTokenData) {
  // console.log(newTokenData);
  // Read the .env file
  const envBuffer = fs.readFileSync(".env");
  const envConfig = dotenv.parse(envBuffer);
  // console.log("Old config: ", envConfig);

  // Update the relevant key with the new value
  envConfig["STRAVA_EXPIRATION_TIME"] = newTokenData.expirationTime;
  envConfig["STRAVA_CACHED_REFRESH_TOKEN"] = newTokenData.refreshToken;
  envConfig["STRAVA_CACHED_TOKEN"] = newTokenData.accessToken;

  // console.log("New config: ", envConfig);

  // Write the updated key-value pair to the file
  const envText = Object.keys(envConfig)
    .map((key) => `${key}=${envConfig[key]}`)
    .join("\n");
  await fs.promises.writeFile(".env", envText);
}

export async function getActualToken() {
  const tokenExpired = isTokenExpired(process.env.STRAVA_EXPIRATION_TIME);

  if (tokenExpired) {
    console.log("The token expiration time has passed");
    const newTokenData = await generateNewToken();

    if (!newTokenData.expirationTime) {
      console.log("There was an error getting refresh token data.");
      return;
    }

    await persistNewTokenData(newTokenData);
    console.log("New token data stored");
  } else if (!tokenExpired) {
    console.log("Token is still valid");
  }
}
