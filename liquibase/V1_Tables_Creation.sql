-- changelog

-- Core tables creation script-- changelog

-- Core tables creation script
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
creation_date timestamp not null default current_date,
modification_date timestamp null
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


