import { IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";


export class CreateRegistrationDto {

   @IsOptional()
   @IsPositive()
   finalGrade?: number;

   @IsInt()
   @IsPositive()
   @IsNotEmpty()
   studentId: number;

   @IsInt()
   @IsPositive()
   @IsNotEmpty()
   subjectId: number;

}
