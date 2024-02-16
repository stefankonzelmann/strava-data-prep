import { getActivityData } from "./stravaData.js";
import { insertActivities } from "./database.js";
import { getActualToken } from "./stravaToken.js";

console.log("Strava Data Update started");
await getActualToken();
const activities = await getActivityData();
await insertActivities(activities);
console.log("Strava Data Update completed");
