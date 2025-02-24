import mysql from "mysql2";

if(!process.env.MYSQL_HOST || !process.env.MYSQL_USERNAME || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
    console.error('Please provide all the MySQL environment variables in the .env file');
    console.error('MYSQL_HOST: ', process.env.MYSQL_HOST);
    console.error('MYSQL_USERNAME: ', process.env.MYSQL_USERNAME);
    console.error('MYSQL_DATABASE: ', process.env.MYSQL_DATABASE);
    process.exit(1);
}

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 5
});

pool.getConnection((err) => {
    if (err) {
        console.error('error connecting: ' + err.message);
        process.exit(1);
    } else {
        console.log('Connected to the MySQL server');
    }
});