import { executeActivityLogic } from "./strava.js";
import { insertActivities } from "./database.js";

executeActivityLogic().then((activities) => {
  console.log(`Received ${activities.length} activities from Strava API`);
  insertActivities(activities);
});
