import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "./document.entity";

@Entity({ name: 'documenttype' })
export class DocumentType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:   "varchar",
        length: 100
    })
    name: string;

    @OneToMany(() => Document, (document) => document.iddocumenttype)
    documents: Document[];
}