import { IsEmail, IsIn, IsMobilePhone, IsOptional, IsString, MinLength } from "class-validator";

export class CreateStudentDto {

   @IsString()
   @MinLength(5)
   identificationNumber: string;

   @IsString()
   @MinLength(3)
   firstName: string;

   @IsString()
   @MinLength(3)
   lastName: string;

   @IsString()
   @IsEmail()
   email: string;

   @IsMobilePhone('es-CO')
   phoneNumber: string;

   @IsString()
   @MinLength(3)
   city: string;

   @IsString()
   @MinLength(3)
   address: string;

   @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
   @IsOptional()
   level?: number;

}
