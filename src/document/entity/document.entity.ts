import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DocumentType } from "./documenttype.entity";
import { StatusEnum } from "src/enums/StatusDocument";
import { Employee } from "src/employee/entity/employee.entity";

@Entity({ name: 'document' })
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 100,
    })
    name: string;

    @Column({
        type:     'enum',
        name:     'status',
        enum:     StatusEnum,
        enumName: 'document_status',
        default:  StatusEnum.PENDING
    })
    status: StatusEnum;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'idemployee' })
    idemployee: Employee;

    @ManyToOne(() => DocumentType, (documenttype) => documenttype.id)
    @JoinColumn({ name: 'iddocumenttype' })
    iddocumenttype: DocumentType;
}