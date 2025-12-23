import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

export function writeDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
