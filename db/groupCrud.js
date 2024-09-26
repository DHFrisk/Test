import { Group } from "./db.js";


export const createGroup = async (name) => {
    try{
        return await Group.create({name: name, creation_date: new Date()});
    }catch(error){
        throw error;
    }
}



export const selectAllGroups = async () => {
    try{
        const Groups = await Group.findAll();
        return Groups;
    }catch(error){
        throw error;
    }
    
}



export const selectGroup = async (id) => {
    try{
        const Groups = await Group.findAll({
            where: {
                id: id
            },
        });
        return Groups;
    }catch(error){
        throw error;
    }
    
}
