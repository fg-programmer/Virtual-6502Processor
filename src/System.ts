import { Hardware } from './hardware/Hardware';
import { CPU } from './hardware/Cpu';
import { Memory } from './hardware/Memory';
import { MMU } from './hardware/MMU';
import { Clock } from './hardware/Clock';

const CLOCK_INTERVAL = 2000; // Interval in milliseconds

export class System extends Hardware {
    private _CPU: CPU;
    private _Memory: Memory;
    private _MMU: MMU; // Add MMU instance
    private _Clock: Clock;

    constructor(id: number) {
        super(id, 'System');
        this._Memory = new Memory(1); // Create the Memory
        this._MMU = new MMU(2, this._Memory); // Create the MMU and pass Memory
        this._CPU = new CPU(0, this._MMU); // Pass the MMU to the CPU constructor
        this._Clock = new Clock(3); // Create the Clock

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
