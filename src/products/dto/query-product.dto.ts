import { IsOptional, IsString, IsObject, IsNumber } from 'class-validator';

export class PriceSubunitFilterDto {
    @IsOptional()
    @IsNumber()
    gte?: number;

    @IsOptional()
    @IsNumber()
    lte?: number;
}

export class FilterProductsDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsObject()
    price_subunit?: PriceSubunitFilterDto;
}