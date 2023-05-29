import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Registration } from "src/registrations/entities/registration.entity";


@Entity()
export class Grade {

   @PrimaryGeneratedColumn('increment')
   id: number;

   @CreateDateColumn({
      type: 'timestamp',
      name: 'creation_date'
   })
   creationDate: Date;

   @Column({
      type: 'float'
   })
   percentege: number;


   @Column({
      type: 'float'
   })
   grade: number;

   @ManyToOne(
      () => Registration,
      (registration) => registration.grades,
      { eager: true }
   )
   @JoinColumn({ name: 'registration_id' })
   registration: Registration

}
