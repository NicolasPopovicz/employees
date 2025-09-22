import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DocumentTypeDTO {
    @IsOptional()
    @IsNumber({}, { message: "O ID precisa ser um número!" })
    @ApiPropertyOptional({ type: Number,  example: 5 })
    id?: number;

    @IsString({ message: "O parâmetro 'name' precisa ser uma string!" })
    @IsNotEmpty({ message: "O parâmetro 'name' é obrigatório!" })
    @ApiProperty({ type: String, example: "Certidão de Nascimento" })
    name: string;
}