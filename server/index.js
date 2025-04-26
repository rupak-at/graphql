import express from "express";
import { db } from "./db.js";

const app = express();


db()

app.listen(4000, () => {
    console.log("listening on port 4000")
})