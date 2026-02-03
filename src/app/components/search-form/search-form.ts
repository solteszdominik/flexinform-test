import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ClientSearchRequest, ClientSearchResult } from '../../models/client-search.model';

type SearchFormModel = {
  name: FormControl<string>;
  card_number: FormControl<string>;
};

function xorGroupValidator(group: FormGroup): ValidationErrors | null {
  const name = group.get('name')?.value?.toString().trim() ?? '';
  const card = group.get('card_number')?.value?.toString().trim() ?? '';

  const hasName = name.length > 0;
  const hasCard = card.length > 0;

  if (!hasName && !hasCard) return { oneRequired: true };
  if (hasName && hasCard) return { onlyOneAllowed: true };
  return null;
}

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss',
})
export class SearchForm {
  @Output() found = new EventEmitter<ClientSearchResult>();

  form: FormGroup<SearchFormModel>;

  loading = false;

  // UI feedback
  formError: string | null = null;
  apiError: string | null = null;
  result: ClientSearchResult | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
  ) {
    this.form = this.fb.group<SearchFormModel>(
      {
        name: this.fb.nonNullable.control('', []),
        card_number: this.fb.nonNullable.control('', [
          Validators.pattern(/^\d*$/), // digits only (empty allowed)
        ]),
      },
      { validators: xorGroupValidator as any },
    );
  }

  // typed getters for template
  get nameCtrl() {
    return this.form.controls.name;
  }

  get cardCtrl() {
    return this.form.controls.card_number;
  }

  reset(): void {
    this.form.reset({ name: '', card_number: '' });
    this.formError = null;
    this.apiError = null;
    this.result = null;
    this.loading = false;
  }

  submit(): void {
    this.formError = null;
    this.apiError = null;
    this.result = null;

    this.form.markAllAsTouched();

    // 1) client-side validation (feladat szerint)
    if (this.form.errors?.['oneRequired']) {
      this.formError = 'Please provide either client name OR document ID.';
      return;
    }
    if (this.form.errors?.['onlyOneAllowed']) {
      this.formError = 'Please fill only one field (name OR document ID), not both.';
      return;
    }
    if (this.cardCtrl.errors?.['pattern']) {
      this.formError = 'Document ID must contain digits only.';
      return;
    }

    const name = this.nameCtrl.value.trim();
    const card = this.cardCtrl.value.trim();

    const body: ClientSearchRequest = name ? { name } : { card_number: card };

    this.loading = true;

    // 2) search (no page reload)
    // Ha nálad más metódus neve van, itt írd át:
    // - searchClientSafe
    // - vagy simán searchClient
    this.api.searchClient(body).subscribe({
      next: (res) => {
        this.loading = false;

        const list = Array.isArray(res) ? res : [];

        if (list.length === 0) {
          this.apiError = 'No results found.';
          return;
        }

        if (name && list.length > 1) {
          this.apiError = `Multiple results found (${list.length}). Please refine the name.`;
          return;
        }

        // Document ID: only exact match accepted → enforce single
        if (card && list.length > 1) {
          this.apiError = `Multiple results found (${list.length}). This is not allowed for document ID search.`;
          return;
        }

        const hit = list[0];
        if (!hit || hit.id == null) {
          this.apiError = 'Search returned an invalid result.';
          return;
        }

        this.result = hit;
        this.found.emit(hit); // ✅ never undefined
      },
      error: (err) => {
        this.loading = false;
        this.apiError = 'An error occurred while searching. Please try again.';
        console.error(err);
      },
    });
  }
}
