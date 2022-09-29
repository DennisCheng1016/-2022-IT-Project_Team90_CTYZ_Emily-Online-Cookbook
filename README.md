## CTYZ-Team COMP30022 Back-end

First, before run the development server:

Please create .env first to configure, set up the below parameters

```
PORT =
JWT_SECRET =
JWT_LIFETIME =
MONGO_URI =
CLOUD_NAME =
CLOUD_API_KEY =
CLOUD_API_SECRET =
```

Then, please install all packages

```bash
npm install
```

Finally, you start the server by

```bash
npm start
```

If you see the below message means the node server run successfully (Default port is 3333)

```bash
Connect Database successfully
Server is listening on port 3333...
```

Open [http://localhost:3333/](http://localhost:3333/) with your browser to see the result.

[API Documentation](http://localhost:3333/api-docs/) can be accessed on [http://localhost:3333/api-docs/](http://localhost:3333/api-docs/). This documentation is Swagger API to show all APIs provided by the back-end. You can also test APIs on it and see the return values.

## Deploy on Heroku

We deploy our back-end on Heroku. Check out our [Online Cookbook API](https://itproject-online-cookbook.herokuapp.com/) for more details.
