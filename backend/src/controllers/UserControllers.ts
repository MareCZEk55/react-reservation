import { Request, Response } from "express";
import { prisma } from "../../db";
import { users } from "@prisma/client"
import { Prisma } from '@prisma/client'
import bcrypt from "bcrypt";


const userClient = prisma.users;
type userRoles = Prisma.usersGetPayload<{
    select: { username:true, roles: {select: {nazev:true}} }
}>

export async function getUsers(req:Request, res:Response): Promise<void>{
    try{
        const allUsers: userRoles[] = await userClient.findMany(
            {
                select:{
                    id:true,
                    username:true,
                    roles:{
                        select:{
                            nazev:true
                        }
                    }
                }
            }
        );

        res.status(200).json(allUsers)
    } catch(err){
        console.log(err)
    }
}

export async function addUser(req: Request, res: Response): Promise<void> {
    try{
        const {username, password, role} = req.body;

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const roleId = await prisma.roles.findUnique({
            where:{
                nazev: role.toLowerCase()
            },
            select:{
                id:true
            }
        })
        if(roleId === undefined || roleId === null){
            res.status(400).json({message: "Nenalezena role"});
            return;
        }

        const newUser = await userClient.create({
            data: {
                username,
                password: hashPassword,
                role_id: roleId.id,
            }
        })
        

        res.status(200).json({username: username, role: role, id: newUser.id})
        } catch (err:any) {
            console.log(err.message)
            res.status(500).json({message:"Došlo k chybě při přidávání"})
        }
}

export async function editUserById(req: Request, res: Response):Promise<void> {
    // try {
    //     const { nazev, poznamka, barva } = req.body;
    //     const { id } = req.params;
    //     const updatedRoom = await roomsClient.update({
    //         where: { id: parseInt(id) },
    //         data:{
    //             nazev,
    //             poznamka,
    //             barva,
    //         }
    //     })
    //     res.status(200).json(updatedRoom)
    // } catch (err:any) {
    //     console.log(err.message)
    //     res.status(500).json({ message: "Chyba při upravování místnosti"})
    // }
}

export async function deleteUserById(req:Request, res:Response):Promise<void> {
    // try{
    //     const { id } = req.params;

    //     const deletedRoom = await roomsClient.delete({
    //         where: {
    //             id: parseInt(id)
    //         }
    //     })
    //     res.status(200).json(deletedRoom)
    // }catch(err:any){
    //     console.log(err.message)
    //     res.status(500).json({ message: "Chyba při odstraňování místnosti"})
    // }
}