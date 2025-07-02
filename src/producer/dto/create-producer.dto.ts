import {
    IsNotEmpty,
    IsString,
    IsArray,
    ValidateNested,
    IsOptional
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { CreatePropertyDto } from '../../property/dto/create-property.dto';
  import { ApiProperty } from '@nestjs/swagger';
  import { IsValidCpfOrCnpj } from '../../common/validators/is-cpf-or-cnpj';
  
  export class CreateProducerDto {
    @ApiProperty({
      example: '82510822004',
      description: 'CPF (11 dígitos) ou CNPJ (14 dígitos) do produtor rural',
    })
    @IsNotEmpty()
    @IsValidCpfOrCnpj({ message: 'CPF ou CNPJ inválido' })
    document: string;
  
    @ApiProperty({
      example: 'João da Silva',
      description: 'Nome do produtor rural',
    })
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @ApiProperty({
      type: [CreatePropertyDto],
      description: 'Lista de propriedades associadas ao produtor',
    })

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePropertyDto)
    properties?: CreatePropertyDto[];
  }
  