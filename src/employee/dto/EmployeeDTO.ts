import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class EmployeeDTO {
    @IsOptional()
    @IsNumber({}, { message: "ID precisa ser um número!" })
    @ApiPropertyOptional({ type: Number })
    id?: number;

    @IsString({ message: "O parâmetro 'name' precisa ser uma string!" })
    @IsNotEmpty({ message: "O parâmetro 'name' é obrigatório!" })
    @ApiProperty({ type: String, example: 'Fulano da Silva' })
    name: string;

    @IsString({ message: "O parâmetro 'document' precisa ser uma string!" })
    @IsNotEmpty({ message: "O parâmetro 'document' é obrigatório!" })
    @ApiProperty({ type: String, example: '123.456.789-00' })
    document: string;
}