import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Veiculo } from '../models/veiculo.model';
import { VehicleData } from '../models/vehicleData.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarroVin } from '../utils/carroVinInterface';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { MenuComponent } from "../menu/menu.component";

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, MenuComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  vehicles: Veiculo[] = [];
  selectedVehicle!: Veiculo;
  vehicleData!: VehicleData;

  carVin!: CarroVin | null;
  private subs = new Subscription();

  // MAPA VIN → IMAGEM (confirme caminhos em src/assets)
  vinImages: Record<string, string> = {
    '2FRHDUYS2Y63NHD22454': 'assets/ranger.png',
    '2RFAASDY54E4HDU34874': 'assets/mustang.png',
    '2FRHDUYS2Y63NHD22455': 'assets/territory.png',
    '2RFAASDY54E4HDU34875': 'assets/bronco.png'
  };

  imgByVin: string | null = null;

  selectCarForms = new FormGroup({
    carId: new FormControl(''),
  });

  vinForm = new FormGroup({
    vin: new FormControl(''),
  });

  constructor(private dashboardservice: DashboardService) {}

  ngOnInit(): void {
    // Carrega veículos
    const vSub = this.dashboardservice.getVehicles().subscribe({
      next: (res: any) => {
        console.debug('getVehicles response', res);
        if (res && (res as any).vehicles) {
          this.vehicles = (res as any).vehicles as Veiculo[];
        } else if (Array.isArray(res)) {
          this.vehicles = res as Veiculo[];
        } else {
          this.vehicles = [];
        }

        if (this.vehicles.length > 0) {
          this.selectedVehicle = this.vehicles[0];
          this.selectCarForms.controls.carId.setValue(String(this.selectedVehicle.id));
        }
      },
      error: (err) => console.error('Erro getVehicles', err)
    });
    this.subs.add(vSub);

    // Quando mudar select de veículo
    const selSub = this.selectCarForms.controls.carId.valueChanges.subscribe((id) => {
      if (!id) {
        this.selectedVehicle = undefined as any;
        return;
      }
      const found = this.vehicles.find((v) => String(v.id) === String(id));
      if (found) {
        this.selectedVehicle = found;
      }
    });
    this.subs.add(selSub);

    // Observa VIN com debounce para não chamar backend a cada tecla
    const vinValueObs = this.vinForm.controls.vin.valueChanges.pipe(
      map(v => (v || '').toString().trim()),
      debounceTime(300),
      distinctUntilChanged()
    );

    const vinSub = vinValueObs.pipe(
      switchMap((vin: string) => {
        // limpa dados quando vin vazio
        if (!vin) {
          this.imgByVin = null;
          this.carVin = null;
          console.debug('VIN vazio — limpando imgByVin e carVin');
          return of(null);
        }

        // se temos imagem local, já define (não espera backend)
        if (this.vinImages[vin]) {
          this.imgByVin = this.vinImages[vin];
          console.debug('Imagem pelo VIN encontrada localmente:', this.imgByVin);
        } else {
          this.imgByVin = null;
          console.debug('VIN não mapeado localmente:', vin);
        }

        // chama o backend para dados do VIN
        return this.dashboardservice.buscarVin(vin);
      })
    ).subscribe({
      next: (res: any) => {
        if (res) {
          this.carVin = res as CarroVin;
          console.debug('buscarVin result:', res);
        } else {
          // res null significa que houve limpeza por vin vazio
        }
      },
      error: (err) => {
        console.error('Erro ao buscar VIN:', err);
        this.carVin = null;
      }
    });

    this.subs.add(vinSub);
  }

  onImgError(event: Event) {
    // se imagem falhar em carregar (404), zera imgByVin para não mostrar broken image
    console.warn('Erro ao carregar imagem', event);
    this.imgByVin = null;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}