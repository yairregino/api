import app from "./app.js";
import "./database.js";
import { PORT } from "./config.js";
import "./libs/initialSetup.js";

app.listen(4004);
console.log("Server on port", 4004);