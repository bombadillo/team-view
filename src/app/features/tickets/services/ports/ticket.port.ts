import { Ticket } from "../../models/Ticket";

export interface TicketPort {
    getTickets(): Promise<Ticket[]>;
}