import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Subject {

   @PrimaryGeneratedColumn('increment')
   id: number;

   @Column({
      type: 'text',
      unique: true
   })
   name: string;

   @Column({
      type: 'text',
      nullable: true
   })
   description: string;

   @Column('numeric')
   credist: number;

   @Column('text')
   faculty: string;

}
