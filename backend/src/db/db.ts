import { DataSource } from "typeorm";
import { join } from "path";

if (
  !process.env.MYSQL_HOST ||
  !process.env.MYSQL_USERNAME ||
  !process.env.MYSQL_PASSWORD ||
  !process.env.MYSQL_DATABASE
) {
  console.error(
    "Please provide all the MySQL environment variables in the .env file"
  );
  console.error("MYSQL_HOST: ", process.env.MYSQL_HOST);
  console.error("MYSQL_USERNAME: ", process.env.MYSQL_USERNAME);
  console.error("MYSQL_DATABASE: ", process.env.MYSQL_DATABASE);
  process.exit(1);
}

// Sync schema to the database, only used for development, default is true if not provided
const sync =
  process.env.ENVIROMENT === "development" ||
  process.env.TYPEORM_SYNCRHONIZE === "true";

console.log("Syncing schema to the database: ", sync);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: sync, // This will sync schema to the ./entities, only used for development
  logging: false,
  entities: [join(__dirname, "entities", "**", "*.{ts,js}")],
  migrations: [
    // For dev
    join(__dirname, "migrations", "**", "*.{ts}"),
    // For prod
    // join(__dirname, "..", "migrations", "**", "*.{js}")
  ],

  /* Optional, comment in if you run into issues
  extra: {
    connectionLimit: 10, // Default is 10, max number of connections in the pool
    connectTimeout: 10000, // Default is 10000, connection timeout in ms
  }, */
});

/*
 * This is just a reminder on how to use the migrations, it can be ignored for development as this is a part of deployment
 * npm run migration:generate -- -n <migration-name>
 * npm run migration:run
 * how to revert if needed:
 * npm run migration:revert
 */
