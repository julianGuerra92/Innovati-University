import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Student } from "src/students/entities/student.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import { Grade } from "src/grades/entities/grade.entity";


@Entity()
export class Registration {

   @PrimaryGeneratedColumn('increment')
   id: number;

   @CreateDateColumn({
      type: 'timestamp',
      name: 'creation_date'
   })
   creationDate: Date;

   @Column({
      type: 'float',
      name: 'final_grade',
      nullable: true
   })
   finalGrade: number;

   @ManyToOne(
      () => Student,
      (student) => student.registrations,
      { eager: true }
   )
   @JoinColumn({ name: 'student_id' })
   student: Student

   @ManyToOne(
      () => Subject,
      (subject) => subject.registrations,
      { eager: true }
   )
   @JoinColumn({ name: 'subject_id' })
   subject: Subject

   @OneToMany(
      () => Grade,
      (grade) => grade.registration
   )
   grades?: Grade[];

}
