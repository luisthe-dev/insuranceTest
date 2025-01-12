export interface User {

    id: number;
    fullName: string;
    userName: string;
    email: string;
    password: string;
    status: "Active" | "Blocked";
    
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

}