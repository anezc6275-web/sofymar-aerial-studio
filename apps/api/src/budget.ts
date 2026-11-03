/** Límite diario de llamadas de pago, para no gastar de más por error. */
export class DailyBudget {
  private dia = DailyBudget.hoy();
  private usadas = 0;

  constructor(private readonly maximo: number) {}

  private static hoy(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private reiniciarSiCambioDia(): void {
    const hoy = DailyBudget.hoy();
    if (hoy !== this.dia) {
      this.dia = hoy;
      this.usadas = 0;
    }
  }

  consumir(): boolean {
    this.reiniciarSiCambioDia();
    if (this.usadas >= this.maximo) return false;
    this.usadas++;
    return true;
  }

  restantes(): number {
    this.reiniciarSiCambioDia();
    return Math.max(0, this.maximo - this.usadas);
  }
}
