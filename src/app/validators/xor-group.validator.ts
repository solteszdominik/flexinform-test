import { AbstractControl, ValidationErrors } from '@angular/forms';

export function xorGroupValidator(control: AbstractControl): ValidationErrors | null {
  const name = control.get('name')?.value?.toString().trim() ?? '';
  const card = control.get('card_number')?.value?.toString().trim() ?? '';

  const hasName = name.length > 0;
  const hasCard = card.length > 0;

  if (!hasName && !hasCard) return { oneRequired: true };
  if (hasName && hasCard) return { onlyOneAllowed: true };
  return null;
}
