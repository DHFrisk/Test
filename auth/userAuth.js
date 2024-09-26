// Appearently bcrypt and jwt aren't written as a modular dependency
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/db.js";
import { selectUserAuth } from "../db/userCrud.js";
import { selectUser, selectAllUsers, createUser, loginUser, selectUserByName } from "../db/userCrud.js";
import { selectGroup, selectAllGroups, createGroup } from "../db/groupCrud.js";
import { selectPermission, selectAllPermissions, createPermission, selectPermissionByName } from "../db/permissionCrud.js";
import { selectAllGroupsPermissions, selectGroupPermission, selectByGroup, selectByPermission, createGroupPermission } from "../db/groupPermissionsCrud.js";
import { selectAllGroupsUsers, selectGroupUser, selectUsersByGroup, selectGroupsByUser, createGroupUser } from "../db/groupUsersCrud.js";


export const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export const assignToken = (id, name) => {
    let id_name = id.toString() + " " + name;
    return jwt.sign({ id_name: id_name }, "superpasssalt", { expiresIn: 1000 * 60 });
};

// This could have been done better, but anyways, I'm running out of time hehe
export const verifyPermission = async (userId, permissionName) => {

    // Look up for permission id based on its name
    // then retrieve all groups that user is assigned to
    // then get all permissions of each group
    let desiredPerm = await selectPermissionByName(permissionName);
    let groups = await selectGroupsByUser(userId);
    for (let group of groups){
        let perms = await selectByGroup(group.group_id);
        for (let perm of perms){
            if (parseInt(perm.permission_id) === parseInt(desiredPerm[0].id)){
                return true;        
            }
        }
    }
    return false
};