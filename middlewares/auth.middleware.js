import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;
        //Checking if token exists AND is in correct format -> Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; //"Bearer TOKEN" -> [1] gives us only the token
        }

        //No token = no entry -> User is not logged in -> 401 = UNAUTHORIZED 
        if(!token) return res.status(401).json({message: 'Unauthorized'});

        // JWT has 3 parts -> HEADER . PAYLOAD . SIGNATURE -> JWT signature is a cryptographic fingerprint that proves the token was created by the server and not modified.
        const decoded = jwt.verify(token, JWT_SECRET);  // It confirms the token is real, still valid, and then extracts the user data from it.

        const user = await User.findById(decoded.userId);

        if(!user) return res.status(401).json({message: 'Unauthorized'}); // Token exists ✔  But user doesn’t exist ❌

        req.user = user;
        next();
    }catch(error){
    res.status(401).json({ message:'Unauthorized', error: error.message})
}
}

export default authorize;