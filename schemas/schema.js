export const typeDefs = `#graphql
    type User {
        id: Int!
        name: String!
        password: String!
        group_id: Int!
        creation_date: String!
        modification_date: String
    }

    type Group {
        id: Int!
        name: String!
        creation_date: String!
        modification_date: String
    }

    type Permission {
        id: Int!
        name: String!
        creation_date: String!
        modification_date: String
    }

    type Group_Permission {
        id: Int!
        group_id: Int!
        permission_id: Int!
        creation_date: String!
        modification_date: String
    }

    type Group_User {
        id: Int!
        group_id: Int!
        user_id: Int!
        creation_date: String!
        modification_date: String
    }

    type SubscriptionPlan {
        id: Int!
        name: String!
        fee: Float!
        benefints: String!
        creation_date: String!
        modification_date: String
    }

    type Client {
        id: Int!
        name: String!
        last_name: String!
        subscription_plan_id: Int!
        creation_date: String!
        modification_date: String
    }

    type Payment {
        id: Int!
        payment_date: String!
        paid_quantity: Float!
        client_id: Int!
        subscription_plan_id: Int!
        creation_date: String!
        modification_date: String
    }

    type Query {
        users: [User]
        user(id: Int!): [User]
        groups: [Group]
        group(id: Int!): [Group]
        permissions: [Permission]
        permission(id: Int!): [Permission]
        groupsPermissions: [Group_Permission]
        groupPermission(id: Int!): [Group_Permission]
        permissionsByGroup(group_id: Int!): [Group_Permission]
        groupsByPermission(permission_id: Int!): [Group_Permission]
        groupsUser: [Group_User]
        groupUser(id: Int!): [Group_User]
        usersByGroup(group_id: Int!): [Group_User]
        groupsByUser(user_id: Int!): [Group_User]
        loginUser(name: String!, password: String!): Token
        subscriptionPlans: [SubscriptionPlan]
        subscriptionPlan(id: Int!): [SubscriptionPlan]
    }

    type Mutation {
        addUser(name: String!, password: String!): User
        addGroup(name: String!): Group
        addPermission(name: String!): Permission
        addGroupPermission(group_id: Int!, permission_id: Int!): Group_Permission
        addGroupUser(group_id: Int!, user_id: Int!): Group_User
        addSubscriptionPlan(name: String!, fee: Float!, benefits: String!): SubscriptionPlan
        changeSubscriptionPlan(id: Int!, name: String!, fee: Float!, benefits: String!): SubscriptionPlan
    }

    type Token {
        token: String
    }
    
`;

/*
    input AddUserInput {
        name: String
        password: String
        groupId: Int
    }

    input AddGroupInput {
        name: String
    }
*/