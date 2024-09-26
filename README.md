# Installation
After cloning the repo run the following command:
```
$ docker-compose up -d
```
You can test if everything is fine by: 
- Connecting to Postgres container with DBeaver (or any other DB management tool).
- Entering Hasura panel in your browser: ```http://localhost:8080/console```
- Checking if Apollo Sandbox is up: ```http://localhost:4000/```



# DB and Liquibase
You can create it with Hasura too, but I like the old way :).
This DB is only basic tables for a gym business, essential administration/management and some tables like ```Clients```, ```Payments```, etc.

To create tables you can either keep reading and apply Liquibase update or copy paste the content inside ```liquibase/V1_Tables_Creation.sql```.

> *If you require authentication/authorization functionality remember: Users should be assigned to Groups and Groups should have Permissions.*

## Liquibase
First of all you should install Liquibase:
- Download and decompress the desired file (in my case .tar.gz) https://github.com/liquibase/liquibase/releases
- This will create a new directory which will be your installation path, thus create an environment variable to be able to use ```liquibase``` executable file wherever you need it, i.e. in a Unix based O.S. run:
```
$ export PATH=<installation_path>:$PATH
```
After it has been installed you can configure it.
- Create and configure a ```liquibase.properties``` file. Basic settings can be found in ```liquibase/liquibase.properties```, there will be configured DB credentials, DB connection, and ```changeLogFile```. This ```changeLogFile``` should be the migration that you'd like to execute
- Being into the directory where ```liquibase.properties``` is located run:
```
$ liquibase update
```
- If the migration was successful you should get an output like this:
```
####################################################
##   _     _             _ _                      ##
##  | |   (_)           (_) |                     ##
##  | |    _  __ _ _   _ _| |__   __ _ ___  ___   ##
##  | |   | |/ _` | | | | | '_ \ / _` / __|/ _ \  ##
##  | |___| | (_| | |_| | | |_) | (_| \__ \  __/  ##
##  \_____/_|\__, |\__,_|_|_.__/ \__,_|___/\___|  ##
##              | |                               ##
##              |_|                               ##
##                                                ## 
##  Get documentation at docs.liquibase.com       ##
##  Get certified courses at learn.liquibase.com  ## 
##                                                ##
####################################################
Starting Liquibase at 02:06:48 using Java 17.0.12 (version 4.29.2 #3683 built at 2024-08-29 16:45+0000)
Liquibase Version: 4.29.2
Liquibase Open Source 4.29.2 by Liquibase
Running Changeset: V2_Adding_Columns.sql::raw::includeAll

UPDATE SUMMARY
Run:                          1
Previously run:               0
Filtered out:                 0
-------------------------------
Total change sets:            1
```

# Project structure
The project follows this logic:
```UserRequest <-> GraphQL/ApolloServer_API <-> Middleware <-> Sequelize <-> PostgreSQL```.

I tried to make everything self-explanatory, you will find:

- DB connection, tables modeling/mapping and basic queries are inside ```./db/```.
- Custom middleware for authentication/authorization is inside ```./auth/userAuth.js```
- GraphQL resolvers are defined in ```./resolvers/resolver.js```
- GraphQL schema is defined in ```./schemas/schema.js```
- ```./.env``` file contains the DB connection string used in Sequelize.

# API Auth
Most endpoint operations require validation (being logged in or authenticated), thus you can generate a valid token after logging in.

- First add a new user, you can use this query:
```
// Query
mutation AddUser($name: String!, $password: String!) {
  addUser(name: $name, password: $password) {
    name
  }
}

// Body
{
  "name": "SomeUser",
  "password": "SomePass"
}

// Response
{
  "data": {
    "addUser": {
      "name": "SomeUser"
    }
  }
}
```

- Then you can log in (this will return a token which will be used to authenticate the user)
```
// Query
query Query($name: String!, $password: String!) {
  loginUser(name: $name, password: $password) {
    token
  }
}

// Body
{
  "name": "SomeUser",
  "password": "SomePass"
}

// Response
{
    "data": {
        "loginUser": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9uYW1lIjoiMTIgSnVhbjQiLCJpYXQiOjE3MjczMjMzOTUsImV4cCI6MTcyNzM4MzM5NX0.PDuZ5ZztD6T9ny3rmdax3OJqUhGYLUw8kTFpXkfWXIg"
        }
    }
}
```

- After getting the token you should set the request header "Authorization" with the token as its value, otherwise for any other Query that you want to execute the response will be something like this:
```
{
  "errors": [
    {
      "message": "User is not authenticated",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "stacktrace": [
          "GraphQLError: User is not authenticated",
          "    at context (file:///home/frisk/Documents/web/graphql_with_postgres/index.js:51:25)",
          "    at context (file:///home/frisk/Documents/web/graphql_with_postgres/node_modules/@apollo/server/dist/esm/express4/index.js:29:28)",
          "    at ApolloServer.executeHTTPGraphQLRequest (file:///home/frisk/Documents/web/graphql_with_postgres/node_modules/@apollo/server/dist/esm/ApolloServer.js:511:38)",
          "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
        ]
      }
    }
  ]
}
```


## Removing auth

You can avoid authentication by commenting the following code blocks in these files:

- ```index.js```

```
...
            if (token !== false ){
                isVerified = jwt.verify(token, "superpasssalt", async (err, decodedToken) => {
                    if (err){
                        throw "Invalid token";
                    }
                    let splitted = decodedToken.id_name.split(" ");
                    const users = await User.findAll({
                        where: {
                            id: parseInt(splitted[0]),
                            name: splitted[1]
                        },
                    });
                    return users[0];
                });
                user = await isVerified;
            }

            // User it not logged in but wants to log in or sign up
            if (
                token === false 
                && req.body.query.toLowerCase().includes("loginuser") === false
                && req.body.query.toLowerCase().includes("adduser") === false
            ){
                  throw new GraphQLError('User is not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: { status: 401 },
                    },
                    });
            }
...
```
- ```resolvers/resolvers.js``` (Just remove the below line in every resolver, otherwise it will look for ```contextValue.user``` values and it will be null -look above ```index.js```-)

```
            if (await verifyPermission(contextValue.user.id, "Some Perm") !== true) throw "You don't have permission to do this";
```

# Dummy data
You can find some dummy DB registers in the CSVs placed in ```./csvs```.