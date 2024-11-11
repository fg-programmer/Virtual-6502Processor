// hardware/Memory.ts
import { Hardware } from './Hardware';

export class Memory extends Hardware {
    private mar: number = 0x0000; // Memory Address Register
    private mdr: string = '00';   // Memory Data Register
    private memory: string[] = new Array(0x10000).fill('00'); // Memory array (64K bytes)
    private readPending: boolean = false;
    private writePending: boolean = false;

    constructor(id: number) {
        super(id, 'Memory');
        this.log(`Created - Addressable space: ${this.memory.length}`);
    }

    // Setters for MAR and MDR
    public setMAR(address: number): void {
        this.mar = address;
        this.log(`MAR set to: ${Hardware.hexLog(address, 4)}`);
    }

    public setMDR(data: string): void {
        this.mdr = data;
        this.log(`MDR set to: ${data}`);
    }

    // Getters for MDR (after read)
    public getMDR(): string {
        return this.mdr;
    }

    // Mark a read as pending
    public read(): void {
        this.readPending = true;
        this.log('Read operation set');
    }

    // Mark a write as pending
    public write(): void {
        this.writePending = true;
        this.log('Write operation set');
    }

    // Clock pulse method
    public pulse(): void {
        if (this.readPending) {
            this.mdr = this.memory[this.mar];
            this.readPending = false;
            this.log(`Read completed. Address: ${Hardware.hexLog(this.mar, 4)}, Data: ${this.mdr}`);
        }

        if (this.writePending) {
            this.memory[this.mar] = this.mdr;
            this.writePending = false;
            this.log(`Write completed. Address: ${Hardware.hexLog(this.mar, 4)}, Data: ${this.mdr}`);
        }
    }
}
