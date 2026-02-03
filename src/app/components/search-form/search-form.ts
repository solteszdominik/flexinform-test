import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ClientSearchResult } from '../../models/client-search.model';
import { CommonModule } from '@angular/common';

function xorValidator(group: AbstractControl): ValidationErrors | null {
  const name = group.get('name')?.value?.toString().trim();
  const card = group.get('card_number')?.value?.toString().trim();

  const nameFilled = !!name;
  const cardFilled = !!card;

  if (!nameFilled && !cardFilled) return { oneRequired: true };
  if (nameFilled && cardFilled) return { onlyOneAllowed: true };
  return null;
}

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss',
})
export class SearchForm implements OnInit {
  @Output() found = new EventEmitter<ClientSearchResult>();

  form!: FormGroup;

  loading = false;
  apiError: string | null = null;
  noHitError: string | null = null;
  multiHitError: string | null = null;
  result: ClientSearchResult | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: [''],
        card_number: ['', [Validators.pattern(/^\d*$/)]],
      },
      { validators: xorValidator },
    );
  }

  get nameCtrl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get cardCtrl(): FormControl {
    return this.form.get('card_number') as FormControl;
  }

  submit(): void {
    this.apiError = this.noHitError = this.multiHitError = null;
    this.result = null;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const name = this.nameCtrl.value?.toString().trim();
    const card = this.cardCtrl.value?.toString().trim();

    const body = name ? { name } : { card_number: card };

    this.loading = true;

    this.api.searchClientSafe(body).subscribe({
      next: (res) => {
        this.loading = false;

        if (!res || res.length === 0) {
          this.noHitError = 'No results found.';
          return;
        }

        if (name && res.length > 1) {
          this.multiHitError = `Multiple results found (${res.length}). Please refine the name.`;
          return;
        }

        if (card && res.length > 1) {
          this.multiHitError = `Multiple results found (${res.length}). Document ID search must be an exact single match.`;
          return;
        }

        this.result = res[0];
        this.found.emit(res[0]);
      },
      error: () => {
        this.loading = false;
        this.apiError = 'An error occurred while searching. Please try again.';
      },
    });
  }

  reset(): void {
    this.form.reset({ name: '', card_number: '' });
    this.apiError = this.noHitError = this.multiHitError = null;
    this.result = null;
  }
}
