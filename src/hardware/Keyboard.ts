import { Hardware } from './Hardware';
import { Interrupt } from './Interrupt';
import { InterruptController } from './InterruptController'


class Keyboard extends Hardware implements Interrupt {
    irqNum: number;
    priority: number;
    deviceName: string;
    inputBuffer: string[] = [];
    outputBuffer: string[] = [];
    private interruptController: InterruptController;

    constructor(irqNum: number, priority: number, interruptController: InterruptController) {
        super(1, 'Input Device: ');;
        this.irqNum = irqNum;
        this.priority = priority;
        this.name = "Keyboard";
        this.interruptController = interruptController;
        this.monitorKeys();
    }

    // Method to simulate monitoring key presses
    private monitorKeys(): void {
        const stdin = process.stdin;

        // Set raw mode for capturing keystrokes without needing 'Enter'
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding(null);

        stdin.on('data', (key: Buffer) => {
            const keyPressed: string = key.toString();

            this.log(`Key pressed - ${keyPressed}`);

            // Handle Ctrl+C to exit the process
            if (keyPressed === '\u0003') {
                process.exit();
            }

            // Add the key to the output buffer
            this.outputBuffer.push(keyPressed);

            // Accept the interrupt
            this.interruptController.acceptInterrupt(this);
        });
    }

    // Triggering interrupt logic for this device
    triggerInterrupt(): void {
        this.log(`Interrupt triggered from ${this.name}. Processing data: ${this.inputBuffer}`);
        // Here you could implement more specific logic for handling input/output
    }
}
