import { Permission } from "./db.js";


export const createPermission = async (name) => {
    try{
        return await Permission.create({name: name, creation_date: new Date()});
    }catch(error){
        throw error;
    }
}



export const selectAllPermissions = async () => {
    try{
        const Permissions = await Permission.findAll();
        return Permissions;
    }catch(error){
        throw error;
    }
    
}



export const selectPermission = async (id) => {
    try{
        const Permissions = await Permission.findAll({
            where: {
                id: id
            },
        });
        return Permissions;
    }catch(error){
        throw error;
    }
    
}


export const selectPermissionByName = async (name) => {
    try{
        const Permissions = await Permission.findAll({
            where: {
                name: name
            },
        });
        return Permissions;
    }catch(error){
        throw error;
    }
    
}

