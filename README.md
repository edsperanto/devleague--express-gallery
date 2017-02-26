Express Gallery
===============

Project start instructions

1. `$npm install`
2. `$sequelize init`
3. edit 'username', 'password' in config/config.json to match credentials for postgres
4. create "architekt" database in postgres
5. `$sequelize db:migrate`
6. `$sequelize db:seed:all`
7. `$npm start`

If encounter "EADDRINUSE" error, run `PORT=xxxx npm start` instead, with "xxxx" being a port number of your choice.

---
