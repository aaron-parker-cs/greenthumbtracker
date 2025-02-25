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

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true, // This will sync schema to the ./entities, only used for development
  logging: false,
  entities: [join(__dirname, "entities", "**", "*.{ts,js}")],
  migrations: [
    // For dev
    join(__dirname, "migrations", "**", "*.{ts}"),
    // For prod
    // join(__dirname, "..", "migrations", "**", "*.{js}")
  ],
});

/*
 * This is just a reminder on how to use the migrations, it can be ignored for development as this is a part of deployment
 * npm run migration:generate -- -n <migration-name>
 * npm run migration:run
 * how to revert if needed:
 * npm run migration:revert
 */
