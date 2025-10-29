import { BugTicket } from "../../models/BugTicket";

export interface BugPort {
    getBugs(): Promise<BugTicket[]>;
}