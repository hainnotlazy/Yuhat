import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
import { RecaptchaModule, RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { environment } from 'src/environments/environment.development';
import { CountdownPipe } from './pipes/countdown.pipe';
import { TimeGapPipe } from './pipes/time-gap.pipe';

@NgModule({
  declarations: [
    CountdownPipe,
    TimeGapPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTooltipModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  exports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTooltipModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CountdownPipe,
    TimeGapPipe,
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: "en"
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.recaptchaClientKey } as RecaptchaSettings
    }
  ]
})
export class SharedModule {}
