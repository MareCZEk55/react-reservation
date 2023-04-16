import { Request, Response } from "express";
import { prisma } from "../../db";
import { users } from "@prisma/client";
import bcrypt from "bcrypt";
import { Prisma } from '@prisma/client'


const userClient = prisma.users;

type userRoles = Prisma.usersGetPayload<{
    select: { username:true, password:true, roles: {select: {nazev:true}} }
}>

export async function login(req:Request, res:Response) {
    const username:string = req.body.username;
    const pass:string = req.body.password;
    if(username === undefined || pass === undefined){
        return res.status(400).json("Wrong Username or Password")
    }
    try{
        const user:userRoles|null = await userClient.findUnique(
            {
                where: {username: username},
                select: {
                    username: true,
                    password: true,
                    roles:{
                        select:{
                            nazev: true
                        }
                    }
                }
            }
        )
        if(!user){
            return res.status(400).json({message:"Wrong Username or Password"});
        }

        const match = await bcrypt.compare(pass, user.password);
        if(!match) return res.status(400).json({message:"Wrong Username or Password"});

        res.status(200).json(user);
    } catch(err){
        return res.status(400).json({message:"Wrong Username or Password"});
    }
}