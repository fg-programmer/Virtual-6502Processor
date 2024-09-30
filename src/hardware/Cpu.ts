// hardware/Cpu.ts
import { Hardware } from './Hardware';
import { ClockListener } from './imp/ClockListener';

export class Cpu extends Hardware implements ClockListener {
    public cpuClockCount: number;

    constructor(id: number) {
        super(id, 'Cpu');
        this.cpuClockCount = 0; // Initialize clock count to 0
        this.log('created');
    }

    // Implement the pulse method from ClockListener
    public pulse(): void {
        this.cpuClockCount++;
        this.log(`received clock pulse - CPU Clock Count: ${this.cpuClockCount}`);
    }
}
