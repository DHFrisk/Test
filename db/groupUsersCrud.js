import { GroupUser } from "./db.js";


export const createGroupUser = async (groupId, userId) => {
    try{
        return await GroupUser.create({group_id: groupId, user_id: userId, creation_date: new Date()});
    }catch(error){
        throw error;
    }
}



export const selectAllGroupsUsers = async () => {
    try{
        const GroupsUsers = await GroupUser.findAll();
        return GroupsUsers;
    }catch(error){
        throw error;
    }
    
}



export const selectGroupUser = async (id) => {
    try{
        const GroupsUsers = await GroupUser.findAll({
            where: {
                id: id
            },
        });
        return GroupsUsers;
    }catch(error){
        throw error;
    }
    
}


export const selectUsersByGroup = async (groupId) => {
    try{
        const GroupsUsers = await GroupUser.findAll({
            where: {
                group_id: groupId
            },
        });
        return GroupsUsers;
    }catch(error){
        throw error;
    }
    
}


export const selectGroupsByUser = async (userId) => {
    try{
        const GroupsUsers = await GroupUser.findAll({
            where: {
                user_id: userId
            },
        });
        return GroupsUsers;
    }catch(error){
        throw error;
    }
    
} 