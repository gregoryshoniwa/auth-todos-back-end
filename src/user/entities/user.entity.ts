import { Todo } from "src/todo/entities/todo.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.User
    })
    role: UserRole;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    @OneToMany(() => Todo, todo => todo.user, { eager: false })
    todos: Todo[];

    @BeforeInsert()
    updateTimestampsOnInsert() {
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    @BeforeUpdate()
    updateTimestampsOnUpdate() {
      this.updatedAt = new Date();
    }

}
