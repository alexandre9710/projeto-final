import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  modo: 'login' | 'cadastro' = 'login';

  // LOGIN
  email = '';
  senha = '';
  loginErro = false;

  // CADASTRO
  cadNome = '';
  cadEmail = '';
  cadSenha = '';
  cadConfirma = '';
  aceito = false;

  constructor(private router: Router, private auth: AuthService) {}

  // LOGIN
  login() {

    // LOGIN ADMIN
    if (this.email === "admin" && this.senha === "123456") {
      this.loginErro = false;
      this.auth.login();
      this.router.navigate(['/home']);
      return;
    }

    const lista = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const user = lista.find((u: any) =>
      u.email === this.email && u.senha === this.senha
    );

    if (user) {
      this.loginErro = false;
      this.auth.login();
      this.router.navigate(['/home']);
      return;
    }

    this.loginErro = true;
  }

  // CADASTRO
  cadastrar() {

    if (!this.cadNome || !this.cadEmail || !this.cadSenha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (this.cadSenha !== this.cadConfirma) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!this.aceito) {
      alert("Você precisa aceitar os Termos.");
      return;
    }

    const lista = JSON.parse(localStorage.getItem("usuarios") || "[]");

    lista.push({
      nome: this.cadNome,
      email: this.cadEmail,
      senha: this.cadSenha
    });

    localStorage.setItem("usuarios", JSON.stringify(lista));

    alert("Cadastro realizado com sucesso!");

    this.modo = "login";
    this.email = "";
    this.senha = "";
    this.cadNome = "";
    this.cadEmail = "";
    this.cadSenha = "";
    this.cadConfirma = "";
    this.aceito = false;
  }
}