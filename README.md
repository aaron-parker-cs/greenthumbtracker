# How to run

First, make sure that you have your .env file set up in the backend/.env. It should look something like:

> [!CAUTION]
> **Never commit your passwords**, this file should be ignored by git by default.

```
MYSQL_USERNAME=your sql username

MYSQL_PASSWORD=your password

MYSQL_DATABASE=GreenThumbDB_dev

MYSQL_HOST=db.greenthumbtracker.org

PORT=8800

JWT_SECRET=insert secret here # THIS IS NOT NECESSARY FOR DEVELOPMENT, can be ignored
```
> [!WARNING]
> **This is very important**, your code will not work without this file being set up.


Next, you will need two terminal windows. This can easily be done in VS Code. Simply open a terminal in each folder, backend, and frontend, and run `npm start` in each and that's it!

Thanks to nodemon and react, any changes you make in either side will reflect immediately to your development environment. To see the webpage, open the result from frontend, it should look something like http://localhost:5173.

# How do I connect to the database using MySQL Workbench?

Setting up a connection in MySQL Workbench is fairly easy. Download the community edition: https://dev.mysql.com/downloads/workbench/, then open it. You should see "MySQL Connections" if it doesn't prompt you to create a connection.

> [!WARNING]
> The port used for MySQL is NOT the same as the ports for backend or frontend. That's because these are all three separate applications and each require a unique port as a result.

1. First, click on create a new connection
2. Next, fill in the connection name as whatever you want
3. Ensure the connection method is set to Standard (TCP/IP)
4. Fill in the hostname, this is `db.greenthumbtracker.org`. The port should be `3306`, if either of these values are different, the connection will fail.
5. Fill in your username
6. Click `Test Connection`, You will be prompted to fill in your password. This is OK to save in the vault.

# That's cool, but how do I commit my changes?

We're going to be making the repository public to enforce branch rules. This means that repository admins will be able to commit directly to the "main" branch, but for every other contributer, they will have to make a branch.

First, you need to have git installed in some form, it doesn't really matter how, but I recommend using the Git client that comes with VS Code since it's simple.

Next, you clone the repository by clicking the green button and copying the link.

You need to check out a new branch, where you'll make your changes.

When you're done, you commit and push your changes, then start a pull request. From there, the other contributers will review your code and when someone approves, the pull request can be completed and your changes will be merged into main when completed.

For simplicity, only one contributer will need to approve a pull request, 

# How do I test my backend routes?

This is a very simple problem that will be solved in the first pull request. Swagger is a utility that we can use to call our own API endpoints without having to use an external tool such as Postman. For this, you simply need to run `npm start` in the backend folder, and then navigate to `http://localhost:8800/swagger`, or whatever port you're using. For now, we have to post to /login, which will create a token, then you can use the other endpoints. 

# iOS App 
We now have a mobile app for iOS! Repo is found [here](https://github.com/tobyish111/GreenThumbTracker.git)
