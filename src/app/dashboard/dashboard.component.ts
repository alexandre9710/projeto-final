import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { DashboardService } from '../services/dashboard.service';
import { Veiculo } from '../models/veiculo.model';
import { CarroVin } from '../utils/carroVinInterface';
import { MenuComponent } from '../menu/menu.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  vehicles: Veiculo[] = [];

  // ✅ Tipagem correta (pode ser null)
  selectedVehicle: Veiculo | null = null;
  carVin: CarroVin | null = null;

  subs: Subscription[] = [];

  selectCarForms = new FormGroup({
    carId: new FormControl<string | null>(null),
  });

  vinForm = new FormGroup({
    vin: new FormControl<string | null>(null),
  });

  constructor(private dashboardservice: DashboardService) {}

  ngOnInit(): void {

    /* ---------------- VEÍCULOS ---------------- */
    const vehiclesSub = this.dashboardservice.getVehicles().subscribe(res => {

      this.vehicles = (res as any)?.vehicles ?? res ?? [];

      const activeId = this.dashboardservice.getVeiculoAtivoId();

      this.selectedVehicle =
        this.vehicles.find(v => Number(v.id) === Number(activeId))
        ?? this.vehicles[0]
        ?? null;

      if (this.selectedVehicle) {
        this.selectCarForms.patchValue(
          { carId: String(this.selectedVehicle.id) },
          { emitEvent: false }
        );
      }
    });
    this.subs.push(vehiclesSub);

    /* ---------------- SELECT ---------------- */
    const selectSub = this.selectCarForms.controls.carId.valueChanges
      .subscribe(id => {

        if (!id) return;

        const found = this.vehicles.find(
          v => String(v.id) === String(id)
        );

        if (found) {
          this.selectedVehicle = found;

          // ✅ conversão correta
          this.dashboardservice.setVeiculoAtivo(Number(found.id));
        }
      });
    this.subs.push(selectSub);

    /* ---------------- VIN ---------------- */
    const vinSub = this.vinForm.controls.vin.valueChanges
      .subscribe(vin => {

        if (!vin || vin.length < 5) {
          this.carVin = null;
          return;
        }

        this.dashboardservice.buscarVin(vin).subscribe(res => {
          this.carVin = res;

          const found = this.vehicles.find(
            v => String(v.id) === String(res.id)
          );

          if (found) {
            this.selectedVehicle = found;

            this.selectCarForms.patchValue(
              { carId: String(found.id) },
              { emitEvent: false }
            );

            // ✅ conversão correta
            this.dashboardservice.setVeiculoAtivo(Number(found.id));
          }
        });
      });
    this.subs.push(vinSub);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
