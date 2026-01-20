import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
    name: 'products'
})
export class Product {

    @ApiProperty({
        example: 'e3ac55f4-d5b0-49ff-a2b9-9c417422720c',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 23,
        description: 'Product price'
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        description: 'Product description',
        nullable: true
    })
    @Column('text', {
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't-shirt-teslo',
        description: 'Product slug',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 1,
        description: 'Product stock'
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L'],
        description: 'Product sizes',
        type: [String]
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'M',
        description: 'Product gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['tag1', 'tag2'],
        description: 'Product tags'
    })
    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[];

    @ApiProperty({
        type: [ProductImage],
        description: 'Product images'
    })
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ApiProperty({
        type: User,
        description: 'Product user'
    })
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user?: User;

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
        }
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}


