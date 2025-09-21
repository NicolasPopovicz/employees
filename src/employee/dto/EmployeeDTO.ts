import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class EmployeeDTO {
    @IsOptional()
    @IsNumber({}, { message: "ID precisa ser um número!" })
    id?: number;

    @IsString({ message: "O parâmetro 'name' precisa ser uma string!" })
    @IsNotEmpty({ message: "O parâmetro 'name' é obrigatório!" })
    name: string;

    @IsString({ message: "O parâmetro 'document' precisa ser uma string!" })
    @IsNotEmpty({ message: "O parâmetro 'document' é obrigatório!" })
    document: string;
}