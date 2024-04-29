import { UserRole } from "../entities/user.entity";

export class ResponseUserDto {
    id: number;
    fistName: string;
    lastName: string;
    email: string;
    role: UserRole;
}
