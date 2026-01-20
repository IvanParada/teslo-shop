import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: 23,
        description: 'Product price'
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        description: 'Product description',
        nullable: true
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 't-shirt-teslo',
        description: 'Product slug',
        uniqueItems: true
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 1,
        description: 'Product stock'
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: ['S', 'M', 'L'],
        description: 'Product sizes',
        type: [String]
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: 'M',
        description: 'Product gender'
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        example: ['tag1', 'tag2'],
        description: 'Product tags'
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        example: ['image1.jpg', 'image2.jpg'],
        description: 'Product images',
        type: [String]
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];




}
