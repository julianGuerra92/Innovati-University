import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Faculty } from "src/faculties/entities/faculty.entity";
import { Registration } from "src/registrations/entities/registration.entity";

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

   @OneToMany(
      () => Registration,
      (registration) => registration.student
   )
   registrations?: Registration[];

}
