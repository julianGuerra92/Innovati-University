import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { FacultiesService } from 'src/faculties/faculties.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class SubjectsService {

  private readonly logger = new Logger('SubjectsService');

  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    private readonly facultiesService: FacultiesService
  ) { }

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      const faculty = await this.facultiesService.findOne(createSubjectDto.facultyId);
      const subject = this.subjectRepository.create({ faculty, ...createSubjectDto });
      await this.subjectRepository.save(subject);
      return subject;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.subjectRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findOneBy({ id });
    if (!subject) throw new NotFoundException(`Subject with id ${id} not found!`)
    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.preload({
      id: id,
      ...updateSubjectDto
    })
    if (!subject) throw new NotFoundException(`Subject with id ${id} not found!`);
    try {
      if (updateSubjectDto.facultyId) {
        const faculty = await this.facultiesService.findOne(updateSubjectDto.facultyId);
        subject.faculty = faculty;
      }
      await this.subjectRepository.save(subject);
      return await this.findOne(subject.id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const subject = await this.findOne(id);
    await this.subjectRepository.remove(subject);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error instanceof NotFoundException) throw new NotFoundException(error.message);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs!');
  }

}
