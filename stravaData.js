import * as dotenv from "dotenv";

dotenv.config();

export async function getActivityData() {
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
    const responseJSON = await response.json();

    console.log(`The API returned ${responseJSON.length} activites`);
    responseJSON.forEach((activity) => {
      console.log(
        `${activity.type} on ${activity.start_date} with ID ${activity.id}`
      );
    });

    return responseJSON;
  } catch (error) {
    console.log("error", error);
  }
}
