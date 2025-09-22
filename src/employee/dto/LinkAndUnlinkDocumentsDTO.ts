import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty } from 'class-validator';

export class LinkAndUnlinkDocumentsDTO {
    @IsArray({ message: "O parâmetro 'documentIds' precisa ser um array!" })
    @ArrayNotEmpty({ message: "O parâmetro 'documentIds' não pode estar vazio!" })
    @ApiProperty({ type: Array<number>, isArray: true, example: [1, 4, 7, 10] })
    documentIds: Array<number>
}