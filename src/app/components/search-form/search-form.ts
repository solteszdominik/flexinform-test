import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ClientSearchRequest, ClientSearchResult } from '../../models/client-search.model';
import { xorGroupValidator } from '../../validators/xor-group.validator';
import { VALIDATION_MESSAGES } from '../../constants/validation-messages';

type SearchFormModel = {
  name: FormControl<string>;
  card_number: FormControl<string>;
};

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchForm {
  private api = inject(ApiService);

  found = output<ClientSearchResult>();

  form = new FormGroup<SearchFormModel>(
    {
      name: new FormControl('', { nonNullable: true }),
      card_number: new FormControl('', {
        nonNullable: true,
        validators: [Validators.pattern(/^\d*$/)],
      }),
    },
    { validators: xorGroupValidator },
  );

  loading = signal(false);
  formError = signal<string | null>(null);
  apiError = signal<string | null>(null);
  result = signal<ClientSearchResult | null>(null);

  // typed getters for template
  get nameCtrl() {
    return this.form.controls.name;
  }

  get cardCtrl() {
    return this.form.controls.card_number;
  }

  reset(): void {
    this.form.reset({ name: '', card_number: '' });
    this.formError.set(null);
    this.apiError.set(null);
    this.result.set(null);
    this.loading.set(false);
  }

  submit(): void {
    this.formError.set(null);
    this.apiError.set(null);
    this.result.set(null);

    this.form.markAllAsTouched();

    if (this.form.errors?.['oneRequired']) {
      this.formError.set(VALIDATION_MESSAGES.oneRequired);
      return;
    }
    if (this.form.errors?.['onlyOneAllowed']) {
      this.formError.set(VALIDATION_MESSAGES.onlyOneAllowed);
      return;
    }
    if (this.cardCtrl.errors?.['pattern']) {
      this.formError.set(VALIDATION_MESSAGES.pattern);
      return;
    }

    const name = this.nameCtrl.value.trim();
    const card = this.cardCtrl.value.trim();

    const body: ClientSearchRequest = name ? { name } : { card_number: card };

    this.loading.set(true);

    this.api.searchClient(body).subscribe({
      next: (res) => {
        this.loading.set(false);

        const list = Array.isArray(res) ? res : [res];

        if (list.length === 0 || !list[0]) {
          this.apiError.set(VALIDATION_MESSAGES.noResults);
          return;
        }

        if (name && list.length > 1) {
          this.apiError.set(
            `${VALIDATION_MESSAGES.multipleResults} (${list.length}). Please refine the name.`,
          );
          return;
        }

        if (card && list.length > 1) {
          this.apiError.set(
            `${VALIDATION_MESSAGES.multipleResults} (${list.length}). This is not allowed for document ID search.`,
          );
          return;
        }

        const hit = list[0];
        if (!hit || hit.id == null) {
          this.apiError.set(VALIDATION_MESSAGES.invalidResult);
          return;
        }

        this.result.set(hit);
        this.found.emit(hit);
      },
      error: (err) => {
        this.loading.set(false);

        if (err?.error?.error) {
          this.apiError.set(err.error.error);
        } else {
          this.apiError.set(VALIDATION_MESSAGES.genericError);
        }
        console.error(err);
      },
    });
  }
}
