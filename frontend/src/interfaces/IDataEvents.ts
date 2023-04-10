export interface IEvents2 {
    event_id: number,
    title: string,
    start: Date,
    end: Date,
    assignee: number,
    subtitle?: string,
    color?: string,
    }

export interface IRooms2{
    room_id: number,
    text: string,
    subtext?: string,
    assignee: number,
    color?: string
}