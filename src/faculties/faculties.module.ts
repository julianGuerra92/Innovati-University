import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacultiesService } from './faculties.service';
import { FacultiesController } from './faculties.controller';
import { Faculty } from './entities/faculty.entity';

@Module({
  controllers: [FacultiesController],
  providers: [FacultiesService],
  imports: [
    TypeOrmModule.forFeature([Faculty])
  ]
})
export class FacultiesModule {}
