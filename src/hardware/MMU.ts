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

    public setMAR(address: number): void {
        this.memory.setMAR(address);
    }

    public setMDR(data: string): void {
        this.memory.setMDR(data);
    }

    public initiateRead(): void {
        this.memory.read();
    }

    public initiateWrite(): void {
        this.memory.write();
    }
}
