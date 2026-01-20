import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {

    @ApiProperty({
        example: 10,
        description: 'Number of items to return',
        default: 10,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        example: 0,
        description: 'Number of items to skip',
        default: 0
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}