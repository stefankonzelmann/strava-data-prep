import * as dotenv from "dotenv";
import { generateNewToken } from "./stravaToken.js";

dotenv.config();

function processActivityData(activities) {
  activities.forEach((activity) => {
    let hr_zone;
    if (activity.average_heartrate <= 137) {
      hr_zone = 2;
    } else if (
      activity.average_heartrate > 137 &&
      activity.average_heartrate < 157
    ) {
      hr_zone = 3;
    } else if (activity.average_heartrate > 157) {
      hr_zone = 4;
    } else {
      hr_zone = undefined;
    }

    activity.hr_zone = hr_zone;
  });

  return activities;
}

async function getActivityDataFromAPI() {
  const authCredentials = await generateNewToken();
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${authCredentials.accessToken}`);

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

    console.log("Activites API Response Code:", response.status);

    const responseJSON = await response.json();

    console.log(`The API returned ${responseJSON.length} activites`);
    responseJSON.forEach((activity) => {
      console.log(
        `${activity.type} on ${activity.start_date} with ID ${activity.id}`
      );
    });
    return responseJSON;
  } catch (error) {
    console.log("Response error", error);
  }
}

export async function getActivityData() {
  const activites = await getActivityDataFromAPI();
  const processedActivites = processActivityData(activites);
  return processedActivites;
}
