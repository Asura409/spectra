import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CheckInDto {
  @IsString() @IsNotEmpty() guardId: string;
  @IsString() @IsNotEmpty() siteId: string;
  @IsNumber() latitude: number;
  @IsNumber() longitude: number;
  @IsString() @IsOptional() photoUrl?: string;
}

export class CheckOutDto {
  @IsString() @IsNotEmpty() guardId: string;
  @IsNumber() latitude: number;
  @IsNumber() longitude: number;
  @IsString() @IsOptional() report?: string;
}
