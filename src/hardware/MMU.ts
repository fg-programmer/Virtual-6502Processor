// hardware/MMU.ts
import { Hardware } from './Hardware';
import { Memory } from './Memory';

export class MMU extends Hardware {
    private memory: Memory;

    constructor(id: number, memory: Memory) {
        super(id, 'MMU');
        this.memory = memory;
        this.log('MMU created and ready for memory management');
    }

    // Set MAR in the Memory
    public setMAR(address: number): void {
        this.memory.setMAR(address);
    }

    // Set MDR in the Memory
    public setMDR(data: string): void {
        this.memory.setMDR(data);
    }

    // Get MDR from the Memory
    public getMDR(): string {
        return this.memory.getMDR();
    }

    // Trigger a read operation in Memory
    public read(): void {
        this.memory.read();
    }

    // Trigger a write operation in Memory
    public write(): void {
        this.memory.write();
    }

    // Trigger a pulse operation in Memory
    public pulse(): void {
        this.memory.pulse();
    }
}