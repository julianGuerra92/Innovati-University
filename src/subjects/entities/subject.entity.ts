import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Faculty } from "src/faculties/entities/faculty.entity";

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
   credits: number;

   @ManyToOne(
      () => Faculty,
      (faculty) => faculty.subjects,
      { cascade: true, onDelete: 'SET NULL', eager: true }
   )
   @JoinColumn({ name: 'faculty_id' })
   faculty: Faculty

}
