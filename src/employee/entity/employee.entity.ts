import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "src/document/entity/document.entity";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 150,
        nullable: false
    })
    name: string;

    @Column({
        type: "varchar",
        length: 14,
    })
    document: string;

    @CreateDateColumn()
    hiredAt: string;

    @OneToMany(() => Document, (document) => document.employeeid)
    documents: Document[]
}