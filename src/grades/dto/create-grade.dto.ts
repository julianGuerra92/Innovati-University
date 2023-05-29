import { IsInt, IsNotEmpty, IsPositive, Max, Min } from "class-validator";


export class CreateGradeDto {

   @Min(0.001)
   @Max(1)
   percentege: number;

   @Min(0)
   @Max(5)
   grade: number;

   @IsInt()
   @IsPositive()
   @IsNotEmpty()
   registrationId: number;

}
