import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './entities/registration.entity';
import { StudentsModule } from 'src/students/students.module';
import { SubjectsModule } from 'src/subjects/subjects.module';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  imports: [
    TypeOrmModule.forFeature([Registration]),
    StudentsModule,
    SubjectsModule
  ],
  exports: [
    RegistrationsService,
    TypeOrmModule
  ]
})
export class RegistrationsModule { }
