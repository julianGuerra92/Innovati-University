import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateSubjectDto {

   @IsString()
   @MinLength(3)
   name: string;

   @IsString()
   @MinLength(3)
   @IsOptional()
   description?: string;

   @IsPositive()
   @IsInt()
   credits: number;

   @IsInt()
   @IsPositive()
   @IsNotEmpty()
   facultyId: number;

}
