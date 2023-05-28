import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { FacultiesService } from './faculties.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) { }

  @Post()
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.facultiesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto
  ) {
    return this.facultiesService.update(+id, updateFacultyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facultiesService.remove(+id);
  }
}
