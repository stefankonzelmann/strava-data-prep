import { getActivityData } from "./stravaData.js";
import { insertActivities } from "./database.js";
import { getActualToken } from "./stravaToken.js";

console.log("Strava Data Update started");

await getActualToken();
const activities = await getActivityData();
console.log(
  `Received ${activities.length} activities from Strava API for inserting to database`
);
await insertActivities(activities);
