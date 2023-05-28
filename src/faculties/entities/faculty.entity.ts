import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Student } from "src/students/entities/student.entity";
import { Subject } from "src/subjects/entities/subject.entity";


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

   @OneToMany(
      () => Student,
      (student) => student.faculty
   )
   students?: Student[];

   @OneToMany(
      () => Subject,
      (subject) => subject.faculty
   )
   subjects?: Subject[];

}
