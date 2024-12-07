export interface Interrupt {
    irqNum: number; // Interrupt request number
    priority: number; // Priority of the interrupt
    deviceName: string; // Name of the device
    inputBuffer?: string[]; // Optional input buffer for incoming data
    outputBuffer?: string[]; // Optional output buffer for outgoing data

    triggerInterrupt(): void
    
}
