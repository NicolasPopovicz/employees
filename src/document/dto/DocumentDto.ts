import { IsString, IsNotEmpty, IsNumber, IsEnum } from "class-validator";
import { StatusEnum } from "src/enums/StatusDocument";

export class DocumentDTO {
    @IsString({ message: "O parâmetro 'name' precisa ser uma string!" })
    @IsNotEmpty({ message: "O parâmetro 'name' é obrigatório!" })
    name: string;

    @IsEnum(StatusEnum)
    @IsNotEmpty({ message: "O parâmetro 'status' é obrigatório!" })
    status: StatusEnum;

    @IsNumber({}, { message: "ID precisa ser um número!" })
    @IsNotEmpty({ message: "O parâmetro 'idemployee' é obrigatório!" })
    idemployee: number;

    @IsNumber({}, { message: "ID precisa ser um número!" })
    @IsNotEmpty({ message: "O parâmetro 'iddocumenttype' é obrigatório!" })
    iddocumenttype: number;
}