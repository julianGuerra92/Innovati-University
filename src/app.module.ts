import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { CommonModule } from './common/common.module';
import { SubjectsModule } from './subjects/subjects.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { GradesModule } from './grades/grades.module';
import { FacultiesModule } from './faculties/faculties.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
          ? { rejectUnauthorized: false }
          : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    StudentsModule,
    CommonModule,
    SubjectsModule,
    RegistrationsModule,
    GradesModule,
    FacultiesModule
  ],
})

export class AppModule { }
