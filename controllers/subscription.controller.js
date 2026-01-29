import Subscription from '../models/subscription.model.js';

// Controller function to handle creating a new subscription
export const createSubscription = async (req, res, next) => {
    try{

        //req.body = { name: "Netflix", price: 499}; const obj = { ...req.body, user: "123"}; -> Becomes:{name: "Netflix",price: 499,user: "123}

        const subscription = await Subscription.create({
            ... req.body,
            user: req.user.id,
        });

        res.status(201).json({ success: true, data: subscription});
    }catch(e){
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try{
        //  a user can fetch only their own subscriptions, not anyone else’s.
        if(req.user.id !== req.params.id){
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id});
        res.status(200).json({success: true, data: subscriptions});
    }catch(e){
        next(e);
    }
}