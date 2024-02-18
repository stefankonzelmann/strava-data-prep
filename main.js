import { getActivityData } from "./stravaData.js";
import { insertActivities } from "./database.js";

console.log("Strava Data Update started");
const activities = await getActivityData();
await insertActivities(activities);
console.log("Strava Data Update completed");
