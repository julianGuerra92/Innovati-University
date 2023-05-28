import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FacultiesService } from 'src/faculties/faculties.service';

@Injectable()
export class StudentsService {

  private readonly logger = new Logger('StudentsService');

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly facultiesService: FacultiesService
  ) { }

  async create(createStudentDto: CreateStudentDto) {
    try {
      const faculty = await this.facultiesService.findOne(createStudentDto.facultyId);
      const student = this.studentRepository.create({ faculty, ...createStudentDto });
      await this.studentRepository.save(student);
      return student;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.studentRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOneById(id: number) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException(`Student with id ${id} not found!`)
    return student;
  }

  async findOneByIdentificaition(identification: string) {
    const query = this.studentRepository.createQueryBuilder('stu');
    const student = await query.where('identification_number =:identification', {
      identification: identification
    }).leftJoinAndSelect('stu.faculty', 'faculty_id')
      .getOne();
    if (!student) throw new NotFoundException(`Student with identification ${identification} not found!`);
    return student;
  }

  async updateById(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.preload({
      id: id,
      ...updateStudentDto
    })
    if (!student) throw new NotFoundException(`Student with id ${id} not found!`);
    try {
      if (updateStudentDto.facultyId) {
        const faculty = await this.facultiesService.findOne(updateStudentDto.facultyId);
        student.faculty = faculty;
      }
      await this.studentRepository.save(student);
      return this.findOneById(student.id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateByIdentification(identification: string, updateStudentDto: UpdateStudentDto) {
    let student = await this.findOneByIdentificaition(identification);
    student = { ...student, ...updateStudentDto };
    try {
      if (updateStudentDto.facultyId) {
        const faculty = await this.facultiesService.findOne(student.faculty.id);
        student.faculty = faculty;
      }
      await this.studentRepository.save(student);
      return student;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const student = await this.findOneById(id);
    await this.studentRepository.remove(student);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error instanceof NotFoundException) throw new NotFoundException(error.message);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs!');
  }

}
