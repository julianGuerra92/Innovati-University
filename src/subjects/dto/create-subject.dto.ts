import { IsIn, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


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
   credist: number;

   @IsIn(['ingenieria', 'ciencias exactas y naturales'])
   faculty: string;

}
