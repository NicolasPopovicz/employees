import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsEnum } from "class-validator";
import { StatusEnum } from "src/enums/StatusDocument";

export class DocumentDTO {
    @IsString({ message: "O parâmetro 'name' precisa ser uma string!" })
    @IsNotEmpty({ message: "O parâmetro 'name' é obrigatório!" })
    @ApiProperty({ type: String, example: "Envio da Certidão de Nascimento" })
    name: string;

    @IsEnum(StatusEnum)
    @IsNotEmpty({ message: "O parâmetro 'status' é obrigatório!" })
    @ApiProperty({ name: "status", enum: StatusEnum, enumName: "StatusEnum", example: "PENDENTE" })
    status: StatusEnum;

    @IsNumber({}, { message: "ID precisa ser um número!" })
    @IsNotEmpty({ message: "O parâmetro 'idemployee' é obrigatório!" })
    @ApiProperty({ type: Number, example: 1 })
    idemployee: number;

    @IsNumber({}, { message: "ID precisa ser um número!" })
    @IsNotEmpty({ message: "O parâmetro 'iddocumenttype' é obrigatório!" })
    @ApiProperty({ type: Number, example: 4 })
    iddocumenttype: number;
}