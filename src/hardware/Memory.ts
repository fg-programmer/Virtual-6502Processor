import { Hardware } from './Hardware';
import { ClockListener } from './imp/ClockListener';

export class Memory extends Hardware implements ClockListener {
    private memory: string[];

    constructor(id: number) {
        super(id, 'Memory');
        this.memory = new Array(0x10000); // 64K memory
        this.initializeMemory();
    }

    public initializeMemory(): void {
        for (let i = 0; i < this.memory.length; i++) {
            this.memory[i] = '00'; // Initialize each memory address with '00'
        }
    }

    // Implement the pulse method from ClockListener
    public pulse(): void {
        this.log('received clock pulse');
    }

    // Additional methods for memory management
    public displayMemory(start: number = 0x00, end: number = 0x14): void {
        for (let i = start; i <= end; i++) {
            let hexAddress = Hardware.hexLog(i, 4);
            let value = this.memory[i] || 'ERR [hexValue conversion]: number undefined';
        }
    }
}
