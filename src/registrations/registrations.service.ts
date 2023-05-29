import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { Registration } from './entities/registration.entity';
import { StudentsService } from 'src/students/students.service';
import { SubjectsService } from 'src/subjects/subjects.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class RegistrationsService {

  private readonly logger = new Logger('RegistrationService');

  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
    private readonly studentsService: StudentsService,
    private readonly subjectsService: SubjectsService
  ) { }

  async create(createRegistrationDto: CreateRegistrationDto) {
    try {
      const student = await this.studentsService.findOneById(createRegistrationDto.studentId);
      const subject = await this.subjectsService.findOne(createRegistrationDto.subjectId);
      const registration = this.registrationRepository.create({ student, subject, ...createRegistrationDto });
      await this.registrationRepository.save(registration);
      return registration;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.registrationRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number) {
    const registration = await this.registrationRepository.findOneBy({ id });
    if (!registration) throw new NotFoundException(`Registration with id ${id} not found!`)
    return registration;
  }

  async update(id: number, updateRegistrationDto: UpdateRegistrationDto) {
    const registration = await this.registrationRepository.preload({ id });
    if (!registration) throw new NotFoundException(`Registration with id ${id} not found!`);
    try {
      if (updateRegistrationDto.studentId) {
        const student = await this.studentsService.findOneById(updateRegistrationDto.studentId);
        registration.student = student;
      }
      if (updateRegistrationDto.subjectId) {
        const subject = await this.subjectsService.findOne(updateRegistrationDto.subjectId);
        registration.subject = subject;
      }
      await this.registrationRepository.save(registration);
      return await this.findOne(registration.id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateFinalGrade(id: number, newValue?: number, oldValue?: number) {
    const registration = await this.registrationRepository.preload({ id });
    if (!registration) throw new NotFoundException(`Registration with id ${id} not found!`);
    try {
      if (oldValue) registration.finalGrade = registration.finalGrade - oldValue;
      if (newValue) registration.finalGrade = registration.finalGrade + newValue;
      await this.registrationRepository.save(registration);
    } catch (error) {
      this.handleDBExceptions(error);

    }
  }

  async remove(id: number) {
    const registration = await this.findOne(id);
    await this.registrationRepository.remove(registration);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error instanceof NotFoundException) throw new NotFoundException(error.message);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs!');
  }

}
