import mysql.connector

# Database connection settings
DB_HOST = "db.greenthumbtracker.org"
DB_USER = "darrelle"
DB_PASSWORD = "fF2Yaj7Wjdn#ygauvk8d"
PORT = 3306
DB_NAME = "GreenThumbDB_dev"

# Connect to MySQL Server
connection = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, port=3306, database=DB_NAME)

cursor = connection.cursor()
cursor.execute("SELECT * FROM users")
users = cursor.fetchall()

for user in users:
    print(user)

# Create Tables
tables = {
    "users": """
        CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(64) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM("user", "admin") DEFAULT "user",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )
    """,
    "plants": """
        CREATE TABLE IF NOT EXISTS plans(
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            species VARCHAR(100) NOT NULL,
            growth_stage VARCHAR(50) NOT NULL,
            height FLOAT,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """,
    "water_records": """
        CREATE TABLE IF NOT EXISTS water_records(
            id INT AUTO_INCREMENT PRIMARY KEY,
            plant_id INT NOT NULL,
            user_id INT NOT NULL,
            water_amount FLOAT NOT NULL,
            water_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (plant_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """,
    "growth_records": """
        CREATE TABLE IF NOT EXISTS growth_records(
            id INT AUTO_INCREMENT PRIMARY KEY,
            plant_id INT NOT NULL,
            height FLOAT NOT NULL,
            growth_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
        )
    """
}

# Execute Table Creation
for tables, create_query in tables.items():
    cursor.execute(create_query)
    print(f"Table '{tables}' created succesfully.")

# Commit changes
connection.commit()
cursor.close()
print("All tables have been successfully created.")

# Check connection success
if connection.is_connected():
    print("Connected to MySQL database successfully.")

# Close connection
connection.close()
