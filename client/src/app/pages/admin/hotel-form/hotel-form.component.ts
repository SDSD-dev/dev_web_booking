// client/src/app/pages/admin/hotel-form/hotel-form.component.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './hotel-form.component.html',
  styleUrl: './hotel-form.component.scss',
})
export class HotelFormComponent {
  private hotelService = inject(HotelService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  hotelForm: FormGroup = this.fb.group ({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['France', Validators.required],
    description: ['', Validators.required],
    piscine: [false],
    spa: [false],
    animaux: [false],
    wifi: [false],
    parking: [false],
    imageUrl: [''],
  });

  isEditMode = false;
  hotelId: number | null = null;
  errorMessage = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    if (id) {
      this.isEditMode = true;
      this.hotelId = Number(id);
      this.loadHotelData(this.hotelId);
    }
  };

  loadHotelData(id: number) {
    this.hotelService.getHotelById(id).subscribe ({
      next: (data: any) => {
        const hotelData = data.hotel;

        this.hotelForm.patchValue({
          name: hotelData.name,
          address: hotelData.address,
          city: hotelData.city,
          country: hotelData.country,
          description: hotelData.description_hotel,
          piscine: !!hotelData.piscine,
          spa: !!hotelData.spa,
          animaux: !!hotelData.animaux,
          wifi: !!hotelData.wifi,
          parking: !!hotelData.parking
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Impossible de charger l'hôtel.";
      }
    })
  };

onSubmit() {
    if (this.hotelForm.invalid) return;

    const formData = this.hotelForm.value;

    if (this.isEditMode && this.hotelId) {
      // MODE UPDATE
      this.hotelService.updateHotel(this.hotelId, formData).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err) => {
            console.error(err);
            this.errorMessage = "Erreur lors de la modification.";
        }
      });
    } else {
      // MODE CREATE
      this.hotelService.createHotel(formData).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err) => {
            console.error(err);
            this.errorMessage = "Erreur lors de la création.";
        }
      });
    }
  }
}
