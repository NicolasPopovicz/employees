import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListDocumentsQueryDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number = 1;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    totalrecords?: number = 10;

    @ApiPropertyOptional({ example: 'João Silva' })
    @IsOptional()
    @IsString()
    employee?: string = '';

    @ApiPropertyOptional({ example: 'CPF' })
    @IsOptional()
    @IsString()
    documenttype?: string = '';
}