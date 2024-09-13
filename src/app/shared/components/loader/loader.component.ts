import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../../service/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  isLoading$ = LoaderService.isLoading;

  constructor(
    public loaderService: LoaderService
  ){}
}
