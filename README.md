# How to run

First, make sure that you have your .env file set up in the backend. It should look something like

MYSQL_USERNAME=your sql username
MYSQL_PASSWORD=your password
MYSQL_DATABASE=GreenThumbDB_dev
MYSQL_HOST=db.greenthumbtracker.org
PORT=8800

Next, you will need two terminal windows. This can easily be done in VS Code. Simply open a terminal in each folder, backend, and frontend, and type "npm start" and that's it!

Thanks to nodemon and react, any changes you make in either side will reflect immediately to your development environment. To see the webpage, open the result from frontend, it should look something like http://localhost:5173.
