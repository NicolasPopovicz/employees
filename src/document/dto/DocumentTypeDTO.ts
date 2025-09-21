import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DocumentTypeDTO {
    @IsOptional()
    @IsNumber({}, { message: "O ID precisa ser um número!" })
    id?: number;

    @IsString({ message: "O parâmetro 'name' precisa ser uma string!" })
    @IsNotEmpty({ message: "O parâmetro 'name' é obrigatório!" })
    name: string;
}