import { Hardware } from './Hardware';
import { ClockListener } from './imp/ClockListener';

export class Clock extends Hardware {
    private listeners: ClockListener[] = [];
    private clockInterval: NodeJS.Timeout | null = null;

    constructor(id: number) {
        super(id, 'Clock');
    }

    // Register a new clock listener
    public addClockListener(listener: ClockListener): void {
        this.listeners.push(listener);
    }

    // Start the clock that sends out pulses
    public startClock(interval: number): void {
        this.log(`Starting clock with interval ${interval} ms`);
        this.clockInterval = setInterval(() => {
            this.pulseAllListeners();
        }, interval);
    }

    // Stop the clock
    public stopClock(): void {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.log('Clock stopped');
        }
    }

    // Pulse all registered listeners
    private pulseAllListeners(): void {
        this.log('Clock pulse sent');
        this.listeners.forEach(listener => listener.pulse());
    }
}
