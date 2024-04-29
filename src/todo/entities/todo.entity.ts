import { IsNotEmpty } from "class-validator";
import { type } from "os";
import { User } from "src/user/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column({default : false})
    completed: boolean;
    @Column()
    description: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    @ManyToOne(() => User, user => user.todos, { nullable: false, onDelete: 'CASCADE',eager: true  })
    user: User;

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
