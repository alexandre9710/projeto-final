import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

export interface Car {
  id: number;
  model: string;
  price: number;
  alturaCacamba: number;
  alturaVeiculo: number;
  alturaSolo: number;
  capacidadeCarga: number;
  motor: number | string;
  potencia: number;
  volumeCacamba: number;
  roda: string;
  image: string;
}

@Component({
  selector: 'app-lancamento',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './lancamento.component.html',
  styleUrls: ['./lancamento.component.style.css', './lancamento.component.reset.css', './lançamento.component.css']
})
export class LancamentoComponent {
  cars: Car[] = [
    {
      id: 1,
      model: 'XL Cabine Simples 2.2 Diesel 4X4 MT 2022',
      price: 183850,
      alturaCacamba: 511,
      alturaVeiculo: 1821,
      alturaSolo: 232,
      capacidadeCarga: 1234,
      motor: '2.2',
      potencia: 160,
      volumeCacamba: 1420,
      roda: 'Aço Estampado 16',
      image: '/xl-cabine.jpg'
    },
    {
      id: 2,
      model: 'XLS 2.2 Diesel 4X4 AT 2022',
      price: 220690,
      alturaCacamba: 511,
      alturaVeiculo: 1821,
      alturaSolo: 232,
      capacidadeCarga: 1076,
      motor: '2.2',
      potencia: 160,
      volumeCacamba: 1180,
      roda: 'Aço Estampado 16',
      image: '/xls-2-2-diesel.jpg'
    },
    {
      id: 3,
      model: 'Storm 3.2 Diesel 4X4 AT 2022',
      price: 222790,
      alturaCacamba: 511,
      alturaVeiculo: 1821,
      alturaSolo: 232,
      capacidadeCarga: 1040,
      motor: '3.2',
      potencia: 200,
      volumeCacamba: 1180,
      roda: 'Liga Leve 17',
      image: '/storm.jpg'
    }
  ];

  selected: number[] = [];
  compareOpen = false;

  toggleSelection(idx: number) {
    const i = this.selected.indexOf(idx);
    if (i >= 0) {
      this.selected.splice(i, 1);
    } else {
      if (this.selected.length < 2) this.selected.push(idx);
      else {
        // If already two selected, replace the second
        this.selected[1] = idx;
      }
    }
  }

  isSelected(idx: number) {
    return this.selected.indexOf(idx) >= 0;
  }

  showCompare() {
    if (this.selected.length < 2) {
      // do nothing or show a message in future
      return;
    }
    this.compareOpen = true;
  }

  hideCompare() {
    this.compareOpen = false;
  }

  clearSelection() {
    this.selected = [];
    this.compareOpen = false;
  }

  formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
