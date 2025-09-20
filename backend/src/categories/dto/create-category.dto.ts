import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
export enum CategoryType { Coffee='Coffee', Restaurant='Restaurant' }

export class CreateCategoryDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsEnum(CategoryType) type!: CategoryType;
}
