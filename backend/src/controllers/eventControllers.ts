import { Request, Response } from "express";
import { prisma } from "../../db";
import { udalosti } from "@prisma/client"

const eventClient = prisma.udalosti;

function getDatumDB(datum:any):Date{
    return new Date(new Date(datum).getTime() - new Date(datum).getTimezoneOffset()*60*1000)
}

/**
 * Vrátí všechny eventy z DB. Vrací všechny sloupce.
 * @param req 
 * @param res 
 */
export async function getEvents(req:Request, res:Response): Promise<void>{
    try{
        const allUdalosti: udalosti[] = await eventClient.findMany();

        res.status(200).json(allUdalosti)
    } catch(err){
        console.log(err)
    }
}

export async function addEvent(req: Request, res: Response): Promise<void> {
    try{
        const {nazev, datum_zacatek, datum_konec, popis, id_mistnost} = req.body;
        let upraveneDatumZacatek = new Date(new Date(datum_zacatek).getTime() - new Date(datum_zacatek).getTimezoneOffset()*60*1000)
        let upraveneDatumKonec = new Date(new Date(datum_konec).getTime() - new Date(datum_konec).getTimezoneOffset()*60*1000)
        const newEvent = await eventClient.create({
            data: {
                nazev,
                datum_zacatek: upraveneDatumZacatek,
                datum_konec: upraveneDatumKonec,
                popis,
                id_mistnost,
            }
        })
    
        res.status(200).json(newEvent)
        } catch (err:any) {
            console.log(err.message)
            res.status(500).json({message:"Došlo k chybě při přidávání události"})
        }
}

export async function editEventById(req: Request, res: Response):Promise<void> {
    try {
        const { nazev, datum_zacatek, datum_konec, popis, id_mistnost } = req.body;
        const { id } = req.params;
        const updatedEvent = await eventClient.update({
            where: { id: parseInt(id) },
            data:{
                nazev,
                datum_zacatek:getDatumDB(datum_zacatek),
                datum_konec:getDatumDB(datum_konec),
                popis,
                id_mistnost,
            }
        })
        res.status(200).json(updatedEvent)
    } catch (err:any) {
        console.log(err.message)
        res.status(500).json({ message: "Chyba při upravování události"})
    }
}

export async function deleteEventById(req:Request, res:Response):Promise<void> {
    try{
        const { id } = req.params;

        const deletedEvent = await eventClient.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.status(200).json(deletedEvent)
    }catch(err:any){
        console.log(err.message)
        res.status(500).json({ message: "Chyba při odstraňování události"})
    }
}