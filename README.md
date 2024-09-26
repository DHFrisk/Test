# Installation
After cloning the repo run the following command:
```
$ docker-compose up -d
```
You can test if everything is fine by: 
- Connecting to Postgres container with DBeaver (or any other DB management tool).
- Entering Hasura panel in your browser: ```http://localhost:8080/console```
- Checking if Apollo Sandbox is up: ```http://localhost:4000/```



# Postgres DB creation script
You can create it with Hasura too, but I like the old way :).
This DB is only basic tables for a gym business, essential administration/management and some tables like ```Clients```, ```Payments``, etc.

*If you require authentication/authorization functionality remember: Users should be assigned to Groups and Groups should have Permissions*



```sql
create table Groups(
id serial primary key not null,
name varchar(50) not null,
creation_date timestamp not null default current_date,
modification_date timestamp null
);

create table Users(
id serial primary key not null,
name varchar(50) unique not null,
password varchar(10485760) not null,
group_id int not null,
creation_date timestamp not null default current_date,
modification_date timestamp null,
foreign_key(group_id) references Groups(id)
);

create table Permissions(
id serial primary key not null,
name varchar(50) not null,
creation_date timestamp not null default current_date,
modification_date timestamp null
);

create table Groups_Permissions(
id serial primary key not null,
group_id int not null,
permission_id int not null,
foreign key(group_id) references Groups(id),
foreign key(permission_id) references Permissions(id),
creation_date timestamp not null default current_date,
modification_date timestamp null
);


create table Groups_Users(
id serial primary key not null,
group_id int not null,
user_id int not null,
foreign key(group_id) references Groups(id),
foreign key(user_id) references Users(id),
creation_date timestamp not null default current_date,
modification_date timestamp null
);


create table SubscriptionPlans(
id serial primary key not null,
name varchar(50) not null,
fee decimal(10, 2) not null,
benefits text,
creation_date timestamp not null default current_date,
modification_date timestamp null
);

create table Clients(
id serial primary key not null,
name varchar(50) not null,
last_name varchar(50) not null,
subscription_plan_id int not null,
foreign key(subscription_plan_id) references SubscriptionPlans(id),
creation_date timestamp not null default current_date,
modification_date timestamp null
);

create table Payments(
id serial primary key not null,
payment_date timestamp not null,
paid_quantity decimal(10,2) not null,
client_id int not null,
subscription_plan_id int not null,
foreign key(client_id) references Clients(id),
foreign key(subscription_plan_id) references SubscriptionPlans(id),
creation_date timestamp not null default current_date,
modification_date timestamp null
);
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