import { IsArray, ArrayNotEmpty } from 'class-validator';

export class LinkAndUnlinkDocumentsDTO {
    @IsArray({ message: "O parâmetro 'documentIds' precisa ser um array!" })
    @ArrayNotEmpty({ message: "O parâmetro 'documentIds' não pode estar vazio!" })
    documentIds: Array<number>
}