import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const date = new Date(value);
    const now = new Date();
    const threeHoursMs = 3 * 60 * 60 * 1000; // 3 horas em milissegundos
    return date.getTime() - now.getTime() >= threeHoursMs;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'A data de vencimento deve ser pelo menos 3 horas no futuro.';
  }
}