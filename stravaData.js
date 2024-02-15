import * as dotenv from "dotenv";

dotenv.config();

export async function getActivityData() {
  console.log("Requesting activity data from Strava...");
  console.log("Using token ", process.env.STRAVA_CACHED_TOKEN);
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
