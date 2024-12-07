import { Hardware } from './Hardware';
import { Interrupt } from './Interrupt';


export class InterruptController extends Hardware {
    private interruptQueue: Interrupt[] = []; // Queue to hold interrupts
    private activeInterrupt?: Interrupt;      // Currently active interrupt

    // Accept an interrupt from a device and add it to the queue
    acceptInterrupt(device: Interrupt): void {
        this.interruptQueue.push(device);
        this.log(`Interrupt from ${device.deviceName} accepted. IRQ: ${device.irqNum}`);
        this.processInterrupts();
    }

    // Process the highest priority interrupt in the queue
    private processInterrupts(): void {
        if (this.interruptQueue.length > 0) {
            // Sort by priority (lower number indicates higher priority)
            this.interruptQueue.sort((a, b) => a.priority - b.priority);
            this.activeInterrupt = this.interruptQueue.shift(); // Get and remove the highest priority interrupt
            if (this.activeInterrupt) {
                this.log(`Processing interrupt from ${this.activeInterrupt.deviceName}`);
                this.activeInterrupt.triggerInterrupt();
            }
        }
    }

    // Method to get the current active interrupt
    getActiveInterrupt(): Interrupt | undefined {
        return this.activeInterrupt;
    }
}
