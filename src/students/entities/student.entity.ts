import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Faculty } from "src/faculties/entities/faculty.entity";
import { Registration } from "src/registrations/entities/registration.entity";

@Entity()
export class Student {

   @PrimaryGeneratedColumn('increment')
   id: number;

   @Column({
      type: 'text',
      unique: true,
      name: "identification_number"
   })
   identificationNumber: string;

   @Column({
      type: 'text',
      name: "first_name"
   })
   firstName: string;

   @Column({
      type: 'text',
      name: "last_name"
   })
   lastName: string;

   @Column({
      type: 'text',
      unique: true
   })
   email: string;

   @Column({
      type: 'text',
      unique: true,
      name: "phone_number"
   })
   phoneNumber: string;

   @Column('text')
   city: string;

   @Column('text')
   address: string;

   @Column({
      type: 'int',
      default: 1
   })
   level: number;

   @ManyToOne(
      () => Faculty,
      (faculty) => faculty.students,
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
