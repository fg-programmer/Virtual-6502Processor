// System.ts
import { Hardware } from './hardware/Hardware';
import { Cpu } from './hardware/Cpu';
import { Memory } from './hardware/Memory';
import { Clock } from './hardware/Clock';

const CLOCK_INTERVAL = 2000; // Interval in milliseconds

export class System extends Hardware {
    private _CPU: Cpu;
    private _Memory: Memory;
    private _Clock: Clock;

    constructor(id: number) {
        super(id, 'System');
        this._CPU = new Cpu(0); // Create the CPU
        this._Memory = new Memory(1); // Create the Memory
        this._Clock = new Clock(2); // Create the Clock

        this.log('System created');
        this.startSystem();
    }

    public startSystem(): boolean {
        this.log('Starting system...');

        // Register CPU and Memory as clock listeners
        this._Clock.addClockListener(this._CPU);
        this._Clock.addClockListener(this._Memory);

        // Start the clock
        this._Clock.startClock(CLOCK_INTERVAL);
        this.log('System started successfully');
        return true;
    }

    public stopSystem(): boolean {
        this._Clock.stopClock();
        this.log('System stopped');
        return false;
    }
}

// Instantiate and start the system
const system = new System(0);
