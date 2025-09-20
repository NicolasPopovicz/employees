import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";
import { DocumentType } from "./documenttype.entity";
import { StatusEnum } from "src/enums/StatusDocument";

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 50,
    })
    name: string;

    @Column({
        type:    "enum",
        enum:    StatusEnum,
        default: StatusEnum.PENDING
    })
    status: StatusEnum;

    @ManyToOne(() => Employee, (employee) => employee.id)
    employeeid: Employee;

    @ManyToOne(() => DocumentType, (documenttype) => documenttype.id)
    documenttypeid: DocumentType;
}