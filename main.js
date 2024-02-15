import { getActivityData } from "./stravaData.js";
import { insertActivities } from "./database.js";
import { getActualToken } from "./stravaToken.js";

await getActualToken();
const activities = await getActivityData();
console.log(`Received ${activities.length} activities from Strava API`);
await insertActivities(activities);
