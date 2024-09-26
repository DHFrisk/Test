// Postgres DB connection

import { Sequelize, DataTypes } from "sequelize";
import 'dotenv/config'

export const db = new Sequelize(process.env.DB_URI);

export const connect = async () => {
    try{
        await db.authenticate();
        console.log("Connected");
    }catch(error){
        console.error("Error ->", error);
        return null;
    }
};

export const close = async () => {
    db.close();
};


// Defining tables
export const User = db.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modification_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: false
    }
);


export const Group = db.define(
    "groups",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modification_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: false
    }
);



export const Permission = db.define(
    "permissions",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modification_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: false
    }
);



export const GroupPermission = db.define(
    "groups_permissions",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modification_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: false
    }
);


export const GroupUser = db.define(
    "groups_users",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modification_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: false
    }
);



export const SubscriptionPlan = db.define(
    "subscriptionplans",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fee: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        benefits: {
            type: DataTypes.STRING,
            allowNull: true
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modification_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        timestamps: false
    }
);



export const Client = db.define(
    "clients",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subscription_plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modification_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        timestamps: false
    }
);



export const Payment = db.define(
    "payments",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        quantity_paid: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subscription_plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modification_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: false
    }
);