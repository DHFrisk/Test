//const db = require("./db");
//const User = db.User;
import { User } from "./db.js";
import { assignToken, encryptPassword } from "../auth/userAuth.js";
import bcrypt from "bcrypt";

// Insert
export const createUser = async (name, password) => {
    try{
        let encryptedPassword =  encryptPassword(password);
        return await User.create({name: name, password: encryptedPassword, creation_date: new Date()});
    }catch(error){
        throw error;
    }
}
    // const x = await User.create({name: "User2", password: "Password", creation_date: new Date()});
    // console.log(x);



export const selectAllUsers = async () => {
    try{
        const users = await User.findAll();
        // users.every(user => user instanceof User);
        //return JSON.stringify(users, null, 2);
        return users;
    }catch(error){
        throw error;
    }
    
}
    // Select
    // const users = await User.findAll();
    // console.log(users.every(user => user instanceof User)); // true
    // console.log('All users:', JSON.stringify(users, null, 2));


export const selectUser = async (id) => {
    try{
        const users = await User.findAll({
            where: {
                id: id
            },
        });
        //users.every(user => user instanceof User);
        //return JSON.stringify(users, null, 2);
        return users;
    }catch(error){
        throw error;
    }
    
}

export const selectUserByName = async (name) => {
    try{
        const users = await User.findAll({
            where: {
                name: name
            },
        });
        //users.every(user => user instanceof User);
        //return JSON.stringify(users, null, 2);
        return users;
    }catch(error){
        throw error;
    }
    
}


export const selectUserAuth = async (id, name) => {
    try{
        const users = await User.findAll({
            where: {
                id: id,
                name: name
            },
        })
        .then((u) => {console.log(u);} )
        .catch();
        //users.every(user => user instanceof User);
        //return JSON.stringify(users, null, 2);
        console.log("selectUserAuth >>>>", users);
        return users;
    }catch(error){
        throw error;
    }
    
}

    // Select Where
    // const users = await User.findAll({
    //     where: {
    //       id: 2,
    //       name: "User2"
    //     },
    //   });
    // console.log(users.every(user => user instanceof User)); // true
    // console.log('All users:', JSON.stringify(users, null, 2));

    // Update 
    // const updatedUser = await User.update(
    //     { name: 'new_user_name' },
    //     {
    //       where: {
    //         id: 2
    //       },
    //     },
    //   );
    // console.log(updatedUser);

    // Delete
    // const deletedUser = await User.destroy({
    //     where: {
    //       id: 2
    //     },
    //   });
    // console.log(updatedUser);


export const loginUser = async (name, password) => {
        const users = await User.findAll({
            where: {
                name: name
                //password: encryptedPassword
            },
        });

        if(!users){
            return false;
        }

        if (bcrypt.compareSync(password, users[0].dataValues.password) === false){
            return false;
        }

        // const retrievedUser = User.build({
        //     id: users[0].dataValues.id,
        //     name: users[0].dataValues.name,
        //     password: "",
        //     creation_date: null,
        //     modification_date: null
        // });

        return {user: users[0], token: assignToken(users[0].dataValues.id, users[0].dataValues.name)};
   
};