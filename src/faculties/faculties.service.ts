import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class FacultiesService {

  private readonly logger = new Logger('FacultiesService');

  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>
  ) { }

  async create(createFacultyDto: CreateFacultyDto) {
    try {
      const faculty = this.facultyRepository.create(createFacultyDto);
      await this.facultyRepository.save(faculty);
      return faculty;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.facultyRepository.find({
      take: limit,
      skip: offset,
      relations: {
        students: true
      }
    });
  }

  async findOne(id: number) {
    const faculty = await this.facultyRepository.findOneBy({ id });
    if (!faculty) throw new NotFoundException(`Faculty with id ${id} not found!`)
    return faculty;
  }

  async update(id: number, updateFacultyDto: UpdateFacultyDto) {
    const faculty = await this.facultyRepository.preload({
      id: id,
      ...updateFacultyDto
    })
    if (!faculty) throw new NotFoundException(`Faculty with id ${id} not found!`);
    try {
      await this.facultyRepository.save(faculty);
      return faculty;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const faculty = await this.findOne(id);
    await this.facultyRepository.remove(faculty);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs!');
  }

}
