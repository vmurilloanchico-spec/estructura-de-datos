import { Component, OnInit } from '@angular/core';

// Función regular
function verificarParImparRegular(numero: number): void {
  if (numero % 2 === 0) {
    console.log(`Función regular: ${numero} es par`);
  } else {
    console.log(`Función regular: ${numero} es impar`);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: ''
})
export class AppComponent implements OnInit {
  // Función flecha
  verificarParImparArrow = (numero: number): void => {
    if (numero % 2 === 0) {
      console.log(`Función flecha: ${numero} es par`);
    } else {
      console.log(`Función flecha: ${numero} es impar`);
    }
  };

  ngOnInit(): void {
    verificarParImparRegular(8);
    this.verificarParImparArrow(7);
  }
}
