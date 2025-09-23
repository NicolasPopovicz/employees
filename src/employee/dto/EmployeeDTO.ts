import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength, MinLength } from "class-validator";

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
    @MaxLength(14, {
        message: "O documento não pode ser maior que 14 dígitos!"
    })
    @MinLength(11, {
        message: "O documento não pode ser menor que 11 dígitos!"
    })
    @ApiProperty({ type: String, example: "123.456.789-00" })
    document: string;
}