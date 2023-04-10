import { Request, Response } from "express";
import { prisma } from "../../db";
import { mistnosti } from "@prisma/client"

const roomsClient = prisma.mistnosti;

export async function getMistnosti(req:Request, res:Response): Promise<void>{
    try{
        const allUdalosti: mistnosti[] = await roomsClient.findMany();

        res.status(200).json(allUdalosti)
    } catch(err){
        console.log(err)
    }
}

export async function addRoom(req: Request, res: Response): Promise<void> {
    try{
        const {nazev, poznamka, barva} = req.body;

        const newRoom = await roomsClient.create({
            data: {
                nazev,
                poznamka,
                barva,
            }
        })
    
        res.status(200).json(newRoom)
        } catch (err:any) {
            console.log(err.message)
            res.status(500).json({message:"Došlo k chybě při přidávání místnosti"})
        }
}

export async function editRoomById(req: Request, res: Response):Promise<void> {
    try {
        const { nazev, poznamka, barva } = req.body;
        const { id } = req.params;
        const updatedRoom = await roomsClient.update({
            where: { id: parseInt(id) },
            data:{
                nazev,
                poznamka,
                barva,
            }
        })
        res.status(200).json(updatedRoom)
    } catch (err:any) {
        console.log(err.message)
        res.status(500).json({ message: "Chyba při upravování místnosti"})
    }
}

export async function deleteRoomById(req:Request, res:Response):Promise<void> {
    try{
        const { id } = req.params;

        const deletedRoom = await roomsClient.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.status(200).json(deletedRoom)
    }catch(err:any){
        console.log(err.message)
        res.status(500).json({ message: "Chyba při odstraňování místnosti"})
    }
}