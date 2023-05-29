import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';
import { RegistrationsService } from 'src/registrations/registrations.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class GradesService {

  private readonly logger = new Logger('GradesService');

  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
    private readonly registerService: RegistrationsService,
  ) { }

  async create(createGradeDto: CreateGradeDto) {
    try {
      const registration = await this.registerService.findOne(createGradeDto.registrationId);
      await this.validateMaxPercentege(registration.id, createGradeDto.percentege);
      const grade = this.gradeRepository.create({ registration, ...createGradeDto });
      await this.gradeRepository.save(grade);
      await this.registerService.updateFinalGrade(registration.id, (createGradeDto.percentege * createGradeDto.grade));
      return grade;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.gradeRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number) {
    const grade = await this.gradeRepository.findOneBy({ id });
    if (!grade) throw new NotFoundException(`Grade with id ${id} not found!`)
    return grade;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    const grade = await this.findOne(id);
    const oldValue = grade.percentege * grade.grade;
    try {
      if (updateGradeDto.percentege) {
        await this.validateUpdateMaxPercentege(grade.registration.id, grade.percentege, updateGradeDto.percentege);
        grade.percentege = updateGradeDto.percentege;
      }
      grade.grade = updateGradeDto.grade;
      await this.gradeRepository.save(grade);
      await this.registerService.updateFinalGrade(grade.registration.id, (grade.percentege * grade.grade), oldValue);
      return this.findOne(grade.id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const grade = await this.findOne(id);
    await this.registerService.updateFinalGrade(grade.registration.id, undefined, (grade.percentege * grade.grade));
    await this.gradeRepository.remove(grade);
  }

  private async validateMaxPercentege(registrationId: number, newValue: number) {
    const total = await this.calculateTotalPercentege(registrationId);
    if ((total + newValue) > 1) throw new BadRequestException('The total percentage of grades cannot be greater than 100%!')
  }

  private async validateUpdateMaxPercentege(registrationId: number, oldValue: number, newValue: number) {
    const total = await this.calculateTotalPercentege(registrationId);
    if (((total - oldValue) + newValue) > 1) throw new BadRequestException('The total percentage of grades cannot be greater than 100%!')
  }

  private async calculateTotalPercentege(registrationId: number) {
    const { total } = await this.gradeRepository
      .createQueryBuilder('grade')
      .select('SUM(grade.percentege)', 'total')
      .where('grade.registration_id = :registrationId', { registrationId })
      .getRawOne();
    return total;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error instanceof NotFoundException) throw new NotFoundException(error.message);
    if (error instanceof BadRequestException) throw new BadRequestException(error.message);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs!');
  }

}
