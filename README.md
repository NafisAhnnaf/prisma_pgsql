## How to get started

1. Clone the repository
    - Run `git clone https://github.com/NafisAhnnaf/prisma_pgsql.git`
    - Then move inside root folder `cd prisma_pgsql`
2. Package Installation:
    - Run `npm install` to install dependencies
3. Set up database
   - Create your PostgreSQL database and note down it's credentials
4. Create the Environement Variables file (.env):
    - Run `touch .env`
    - Add the line `DATABASE_URL=postgres://username:password@hostname/dbname`
    - Make sure to replace ***username***, ***password***, ***hostname*** and ***dbname*** with their actual values
5. Run the server:
    - Finally run `node server.js` to get the server up and running
6. (OPTIONAL) Test it out Postman
    - Use Postman or similar software to test the endpoints.