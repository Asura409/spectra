import { IsEmail, IsString, MinLength, IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsString()
  @IsIn(['CEO', 'OPERATIONS_MANAGER', 'HR', 'SUPERVISOR', 'GUARD', 'CLIENT'], {
    message: 'Role must be one of: CEO, OPERATIONS_MANAGER, HR, SUPERVISOR, GUARD, CLIENT',
  })
  role: string;
}
