import { Component, forwardRef, signal, computed, effect, output, viewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormControl, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { getCountries, getCountryCallingCode, CountryCode, parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';


export interface PhoneNumberData {
  countryCode: CountryCode;
  phoneNumber: string;
}

@Component({
  selector: 'app-phone-number',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="phone-number-container">
      <mat-form-field appearance="outline" class="country-select">
        <mat-label>Country</mat-label>
        <mat-select [formControl]="countryControl">
          @for (country of countries(); track country) {
            <mat-option [value]="country">
              {{ country }} (+{{ getCallingCode(country) }})
            </mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="phone-input">
        <mat-label>Phone Number</mat-label>
        <input matInput 
               [formControl]="phoneControl" 
               type="tel"
               (blur)="onTouched()">
        @if (phoneControl.invalid && (phoneControl.dirty || phoneControl.touched)) {
             <mat-error>Invalid phone number</mat-error>
        }
      </mat-form-field>
    </div>
  `,
  styles: [`
    .phone-number-container {
      display: flex;
      gap: 16px;
      width: 100%;
    }
    .country-select {
      flex: 1;
      min-width: 120px;
    }
    .phone-input {
      flex: 2;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneNumberComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneNumberComponent),
      multi: true
    }
  ]
})
export class PhoneNumberComponent implements ControlValueAccessor, Validator {
  
  countries = signal<CountryCode[]>(getCountries());
  
  countryControl = new FormControl<CountryCode>('US', { nonNullable: true });
  phoneControl = new FormControl<string>('', { nonNullable: true });

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    this.countryControl.valueChanges.subscribe(val => {
      this.updateValue();
    });

    this.phoneControl.valueChanges.subscribe(val => {
      this.updateValue();
    });
  }

  getCallingCode(country: CountryCode): string {
    return getCountryCallingCode(country);
  }

  updateValue() {
    const country = this.countryControl.value;
    const number = this.phoneControl.value;
    
    // We emit the object { countryCode, phoneNumber } or just the full E.164 string?
    // User requested: "incorporate into different FormGroup... phone number control - contains phoneNumber and country two inputs"
    // Usually a CVA returns a single value. 
    // If the parent form expects a single string (E.164), we should format it.
    // However, the user said "phoneNumber control - contains phoneNumber and country two inputs". 
    // And in the design it looks like they might want to store them?
    // Let's return an object for maximum flexibility as requested 'phoneNumber control' implies the composite value.
    // Or, common practice: return the E.164 formatted string if valid, or raw input if not?
    // Let's return the E.164 string as the value of this control, because backend usually just wants the phone number.
    
    // Wait, the user said: "phoneNumber control - contains phoneNumber and country two inputs... become a reusable component... incorporated into different FormGroup".
    // If this component is the "Phone Number" control, it's cleaner if it returns one value (the full phone number).
    // Let's try to parse it.
    
    if (country && number) {
      try {
        const parsed = parsePhoneNumber(number, country);
        if (parsed && parsed.isValid()) {
             this.onChange(parsed.number); // E.164
        } else {
             this.onChange({ countryCode: country, number: number }); // Return raw if invalid/incomplete to maintain state? 
             // Actually, standard CVA usually returns the 'value'. 
             // If validation fails, we still return the value so the validator can mark it invalid.
             // Let's return a composite object or a string. 
             // Given the UI shows separate fields, let's return an object so we can repopulate it correctly.
             this.onChange({ countryCode: country, number: number });
        }
      } catch (e) {
        this.onChange({ countryCode: country, number: number });
      }
    } else {
       this.onChange(null);
    }
  }

  writeValue(value: any): void {
    if (value) {
       // Handle both E.164 string or object
       if (typeof value === 'string') {
          // Attempt to parse string to extract country
          // This is tricky without a default country if it's just a local number, but if E.164 it works.
          try {
             const parsed = parsePhoneNumber(value);
             if (parsed) {
               this.countryControl.setValue(parsed.country as CountryCode, { emitEvent: false });
               this.phoneControl.setValue(parsed.nationalNumber, { emitEvent: false });
             }
          } catch(e) {
             // If parse fails, just put it in number
             this.phoneControl.setValue(value, { emitEvent: false });
          }
       } else if (typeof value === 'object') {
          if (value.countryCode) this.countryControl.setValue(value.countryCode, { emitEvent: false });
          if (value.number) this.phoneControl.setValue(value.number, { emitEvent: false });
       }
    } else {
      this.phoneControl.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.countryControl.disable();
      this.phoneControl.disable();
    } else {
      this.countryControl.enable();
      this.phoneControl.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const country = this.countryControl.value;
    const number = this.phoneControl.value;
    
    if (!number) return null; // Let 'required' validator handle empty
    
    try {
        if (!isValidPhoneNumber(number, country)) {
            return { invalidPhoneNumber: true };
        }
    } catch (e) {
        return { invalidPhoneNumber: true };
    }
    
    return null;
  }
}
