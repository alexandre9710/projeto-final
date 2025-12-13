import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; // Removido 'model'
import { Observable, BehaviorSubject } from 'rxjs'; // Adicionado BehaviorSubject
import { CarroVin } from '../utils/carroVinInterface';
import { VeiculosAPI} from '../models/veiculo.model'


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:3001';
  
  // 1. Variável de estado para o Veículo Ativo (private para controle interno)
  // undefined significa que nenhum veículo está ativo.
  private veiculoAtivoIdSource = new BehaviorSubject<number | undefined>(undefined);

  constructor(private http: HttpClient) { }

  /**
   * ✅ MÉTODO ADICIONADO: Define o ID do veículo ativo.
   * O DashboardComponent chama este método para salvar a seleção.
   */
  setVeiculoAtivo(id: number | undefined): void {
    this.veiculoAtivoIdSource.next(id);
    console.log('Service: Veículo Ativo ID atualizado para:', id);
  }

  /**
   * ✅ MÉTODO ADICIONADO: Retorna o ID do veículo ativo.
   * O DashboardComponent chama este método no ngOnInit para restaurar a seleção.
   */
  getVeiculoAtivoId(): number | undefined {
    return this.veiculoAtivoIdSource.value;
  }

  // MÉTODOS EXISTENTES

  getVehicles(): Observable<VeiculosAPI>{
    return this.http.get<VeiculosAPI> (`${this.baseUrl}/vehicles`)
  }
  
  buscarVin(codigoVin: string): Observable<CarroVin>{
    const reqVin = this.http.post<CarroVin>(`${this.baseUrl}/vehicleData`, {vin: codigoVin})
    return reqVin
  }
}