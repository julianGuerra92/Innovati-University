import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Faculty {

   @PrimaryGeneratedColumn('increment')
   id: number;

   @Column({
      type: 'text',
      unique: true
   })
   name: string;

   @CreateDateColumn({
      type: 'timestamp',
      name: 'creation_date'
   })
   creationDate: Date;

}
