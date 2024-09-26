// import { ApolloServer } from "apollo-server"
import { db, User } from "../db/db.js";
import { selectUser, selectAllUsers, createUser, loginUser, selectUserByName } from "../db/userCrud.js";
import { selectGroup, selectAllGroups, createGroup } from "../db/groupCrud.js";
import { selectPermission, selectAllPermissions, createPermission, selectPermissionByName } from "../db/permissionCrud.js";
import { selectAllGroupsPermissions, selectGroupPermission, selectByGroup, selectByPermission, createGroupPermission } from "../db/groupPermissionsCrud.js";
import { selectAllGroupsUsers, selectGroupUser, selectUsersByGroup, selectGroupsByUser, createGroupUser } from "../db/groupUsersCrud.js";
import { createSubscriptionPlan, selectAllSubscriptionPlans, selectSubscriptionPlan, updateSubscriptionPlan } from "../db/subscriptionPlanCrud.js";
import { verifyPermission } from "../auth/userAuth.js";
// import { loginUser, encryptPassword } from "../middleware/userMiddleware.js";



export const resolvers = {
    Query: {

        // Auth
        async loginUser(_, args, contextValue){
            let token = null;

            if (contextValue.token === false)
            {
                await loginUser(args.name, args.password)
                .then((t) => {
                    //contextValue.token = t.token;
                    token = t.token;
                    //retrievedUser = t.user;
                })
                .catch((error) => {
                    throw error;
                });
            }else{
                token = contextValue.token;
            }

            return {token: token};
        },

        users(_, args){
            return selectAllUsers(); 
        },
        user(_, args){
            return selectUser(args.id);
        },
        groups(_, args){
            return selectAllGroups();
        },
        group(_, args){
            return selectGroup(args.id);
        },
        permissions(_, args){
            return selectAllPermissions();
        },
        permission(_, args){
            return selectPermission(args.id);
        },
        groupsPermissions(_, args){
            return selectAllGroupsPermissions();
        },
        groupPermission(_, args){
            return selectGroupPermission(args.id);
        },
        permissionsByGroup(_, args){
            return selectByGroup(args.group_id);
        },
        groupsByPermission(_, args){
            return selectByPermission(args.permission_id);
        },
        groupsUser(_, args){
            return selectAllGroupsUsers();
        },
        groupUser(_, args){
            return selectGroupUser(args.id);
        },
        usersByGroup(_, args){
            return selectUsersByGroup(args.group_id);
        },
        groupsByUser(_, args){
            return selectGroupsByUser(args.permission_id);
        },

        async subscriptionPlans(_, args, contextValue){
            if (await verifyPermission(contextValue.user.id, "Leer Planes") !== true) throw "You don't have permission to do this";
            return await selectAllSubscriptionPlans();
        },
        async subscriptionPlan(_, args, contextValue){
            if (await verifyPermission(contextValue.user.id, "Leer Planes") !== true) throw "You don't have permission to do this";
            return await selectSubscriptionPlan(args.id);
        }

    },
    Mutation: {
        addUser(_, args){
            return createUser(args.name, args.password);
        },
        addGroup(_, args){
            return createGroup(args.name);
        },
        addPermission(_, args){
            return createPermission(args.name);
        },
        addGroupPermission(_, args){
            return createGroupPermission(args.group_id, args.permission_id);
        },
        addGroupUser(_, args){
            return createGroupUser(args.group_id, args.user_id);
        },
        async addSubscriptionPlan(_, args, contextValue){
            if (await verifyPermission(contextValue.user.id, "Agregar Planes") !== true) throw "You don't have permission to do this";
            return await createSubscriptionPlan(args.name, args.fee, args.benefits);
        },
        async changeSubscriptionPlan(_, args, contextValue){
            if (await verifyPermission(contextValue.user.id, "Modificar Planes") !== true) throw "You don't have permission to do this";
            return await updateSubscriptionPlan(args.id, args.name, args.fee, args.benefits);
        },
    }
};
