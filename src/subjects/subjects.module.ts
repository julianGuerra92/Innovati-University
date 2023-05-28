import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from './entities/subject.entity';
import { FacultiesModule } from 'src/faculties/faculties.module';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  imports: [
    TypeOrmModule.forFeature([Subject]),
    FacultiesModule
  ]
})
export class SubjectsModule { }
