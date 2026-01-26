import { Router } from "express";

const authRouter = Router();

authRouter.post('/sign-up',(req,res)=>res.send({title: 'Signup'}));
authRouter.post('/sign-in', (req,res)=>res.send({title: 'Sign in'}));
authRouter.post('/sign-out', (req,res)=>res.send({title: 'Sign Out'}));

export default authRouter;