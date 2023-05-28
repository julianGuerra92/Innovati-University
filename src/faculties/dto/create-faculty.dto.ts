import { Transform } from "class-transformer";
import { IsDate, IsOptional, IsString, MinLength } from "class-validator";


export class CreateFacultyDto {

   @IsString()
   @MinLength(3)
   name: string;

   @Transform(({ value }) => new Date(value))
   @IsDate()
   @IsOptional()
   creationDate?: Date;

}
