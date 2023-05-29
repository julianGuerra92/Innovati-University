import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { Grade } from './entities/grade.entity';
import { RegistrationsModule } from 'src/registrations/registrations.module';

@Module({
  controllers: [GradesController],
  providers: [GradesService],
  imports: [
    TypeOrmModule.forFeature([Grade]),
    RegistrationsModule
  ],
  exports: [
    GradesService,
    TypeOrmModule
  ]
})
export class GradesModule {}
