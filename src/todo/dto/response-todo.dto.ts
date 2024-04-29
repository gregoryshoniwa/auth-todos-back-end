

export class ResponseTodoDto {
    id: number;
    title: string;
    completed: boolean;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    userId?: string;
    userEmail?: string;
}
