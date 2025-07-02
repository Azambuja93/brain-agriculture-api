import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  import { cpf, cnpj } from 'cpf-cnpj-validator';
  
  export function IsValidCpfOrCnpj(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isValidCpfOrCnpj',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          validate(value: string, args: ValidationArguments) {
            return cpf.isValid(value) || cnpj.isValid(value);
          },
          defaultMessage(args: ValidationArguments) {
            return 'CPF ou CNPJ inválido';
          },
        },
      });
    };
  }
  