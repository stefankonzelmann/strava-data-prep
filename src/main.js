import { executeActivityLogic } from "./modules/strava.js";
import { insertActivities } from "./modules/database.js";

executeActivityLogic().then((activities) => {
  console.log(activities);
  insertActivities(activities).then((result) => console.log(result));
});
