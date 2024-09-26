import { GroupPermission } from "./db.js";


export const createGroupPermission = async (groupId, permissionId) => {
    try{
        return await GroupPermission.create({group_id: groupId, permission_id: permissionId, creation_date: new Date()});
    }catch(error){
        throw error;
    }
}



export const selectAllGroupsPermissions = async () => {
    try{
        const GroupsPermissions = await GroupPermission.findAll();
        return GroupsPermissions;
    }catch(error){
        throw error;
    }
    
}



export const selectGroupPermission = async (id) => {
    try{
        const GroupsPermissions = await GroupPermission.findAll({
            where: {
                id: id
            },
        });
        return GroupsPermissions;
    }catch(error){
        throw error;
    }
    
}


export const selectByGroup = async (groupId) => {
    try{
        const GroupsPermissions = await GroupPermission.findAll({
            where: {
                group_id: groupId
            },
        });
        return GroupsPermissions;
    }catch(error){
        throw error;
    }
    
}


export const selectByPermission = async (permissionId) => {
    try{
        const GroupsPermissions = await GroupPermission.findAll({
            where: {
                permission_id: permissionId
            },
        });
        return GroupsPermissions;
    }catch(error){
        throw error;
    }
    
}
