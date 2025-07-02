import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidCpfOrCnpj } from '../../common/validators/is-cpf-or-cnpj';

export class UpdateProducerDto {
  @ApiProperty({
    example: 'Maria Souza',
    description: 'Nome atualizado do produtor rural',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '98765432100',
    description: 'CPF ou CNPJ atualizado do produtor rural',
  })
  @IsString()
  @IsNotEmpty()
  @IsValidCpfOrCnpj({ message: 'CPF ou CNPJ inválido' })
  document: string;
}
