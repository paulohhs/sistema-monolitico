import { migrator } from "../../../migrations/config/migrator";
import { app, sequelize } from "./express";
import dotenv from "dotenv";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;

migrator(sequelize).up();
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
