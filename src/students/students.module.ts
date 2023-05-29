import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { FacultiesModule } from 'src/faculties/faculties.module';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports: [
    TypeOrmModule.forFeature([Student]),
    FacultiesModule
  ],
  exports: [
    StudentsService,
    TypeOrmModule
  ]
})
export class StudentsModule {}
