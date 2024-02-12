import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

export function isTokenExpired(currentExpirationTime) {
  const currentEpochTime = Date.now();

  if (currentExpirationTime === "undefined") {
    return `There is an error with the currentEpirationTime, it's value is: ${currentExpirationTime}.`;
  }
  // console.log("Now: ", currentEpochTime);
  // console.log("Expiration: ", currentExpirationTime * 1000);
  return currentEpochTime > currentExpirationTime * 1000;
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

const persistNewTokenData = async (newTokenData) => {
  console.log(newTokenData);
  // Read the .env file
  const envBuffer = fs.readFileSync(".env");
  const envConfig = dotenv.parse(envBuffer);
  console.log("Old config: ", envConfig);

  // Update the relevant key with the new value
  envConfig["STRAVA_EXPIRATION_TIME"] = newTokenData.expirationTime;
  envConfig["STRAVA_CACHED_REFRESH_TOKEN"] = newTokenData.refreshToken;
  envConfig["STRAVA_CACHED_TOKEN"] = newTokenData.accessToken;

  console.log("New config: ", envConfig);

  // Write the updated key-value pair to the file
  const envText = Object.keys(envConfig)
    .map((key) => `${key}=${envConfig[key]}`)
    .join("\n");
  await fs.promises.writeFile(".env", envText);
};

async function getActivityData() {
  console.log("Requesting activity data from Strava...");
  let myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${process.env.STRAVA_CACHED_TOKEN}`
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=5",
      requestOptions
    );
    return response.json();
  } catch (error) {
    console.log("error", error);
  }
}

export async function executeActivityLogic() {
  const tokenExpired = isTokenExpired(process.env.STRAVA_EXPIRATION_TIME);

  if (typeof tokenExpired === "string") {
    console.log(
      "Please resolve the error with the current expiration time stored in the .env file."
    );
    return;
  } else if (tokenExpired) {
    console.log("The expiration time has passed. Generating a new token...");
    //if yes - generate a new token
    const newTokenData = await generateNewToken();
    if (!newTokenData.expirationTime) {
      console.log("There was an error getting refresh token data.");
      return;
    }
    //save the new token info to .env
    persistNewTokenData(newTokenData);
  }
  //make request to Strava activities endpoint
  const stravaActivityData = await getActivityData();
  return stravaActivityData;
}
