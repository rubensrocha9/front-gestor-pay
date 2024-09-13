import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@ant-design/icons-angular';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { DocumentPipePipe } from '../../core/pipes/document-pipe.pipe';
import { PhoneNumberPipe } from '../../core/pipes/phone-number.pipe';
import { LoaderComponent } from '../components/loader/loader.component';
import { ZorroModule } from './zorro.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    IconModule,

    ReactiveFormsModule,
    FormsModule,

    ZorroModule,

    LoaderComponent,
    DocumentPipePipe,
    PhoneNumberPipe
  ],
  exports: [
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,

    ReactiveFormsModule,
    FormsModule,

    ZorroModule,

    LoaderComponent,
    DocumentPipePipe,
    PhoneNumberPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideNgxMask(),
    { provide: LOCALE_ID, useValue: 'pt' }
  ],
})
export class SharedModuleModule { }
