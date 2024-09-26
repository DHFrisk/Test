import { SubscriptionPlan } from "./db.js";


export const createSubscriptionPlan = async (name, fee, benefits) => {
    try{
        return await SubscriptionPlan.create({name: name, fee: fee, benefits: benefits, creation_date: new Date()});
    }catch(error){
        throw error;
    }
}



export const selectAllSubscriptionPlans = async () => {
    try{
        const SubscriptionPlans = await SubscriptionPlan.findAll();
        return SubscriptionPlans;
    }catch(error){
        throw error;
    }
    
}



export const selectSubscriptionPlan = async (id) => {
    try{
        const SubscriptionPlans = await SubscriptionPlan.findAll({
            where: {
                id: id
            },
        });
        return SubscriptionPlans;
    }catch(error){
        throw error;
    }
    
}


export const updateSubscriptionPlan = async (id, name, fee, benefits) => {
    try{
        const SubscriptionPlans = await SubscriptionPlan.findAll({
            where: {
                id: id
            },
        });
        let sub = SubscriptionPlans[0];
        if (name) sub.name = name;
        if (fee) sub.fee = fee;
        if (benefits) sub.benefits = benefits;
        await sub.save(); 
        return sub;
    }catch(error){
        console.log(error);
        throw error;
    }

}
