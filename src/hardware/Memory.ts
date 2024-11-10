// hardware/Memory.ts
// hardware/Memory.ts
import { Hardware } from './Hardware';
import { ClockListener } from './imp/ClockListener';

export class Memory extends Hardware implements ClockListener {
    private memory: string[];
    private mar: number; // Memory Address Register
    private mdr: string; // Memory Data Register

    constructor(id: number) {
        super(id, 'Memory');
        this.memory = new Array(0x10000).fill('00'); // 64K memory initialized to '0x00'
        this.mar = 0x0000; // Initialize MAR to 0
        this.mdr = '00'; // Initialize MDR to '0x00'
        this.log(`Created - Addressable space: ${this.memory.length}`);
    }

    // Implement the pulse method from ClockListener
    public pulse(): void {
        this.log('received clock pulse');
    }

    // Resets all memory and registers to '0x00'
    public reset(): void {
        this.mar = 0x0000;
        this.mdr = '00';
        this.memory.fill('00');
        this.log('Memory reset to all 0x00');
    }

    // Getter and setter for the Memory Address Register (MAR)
    public getMAR(): number {
        return this.mar;
    }

    public setMAR(address: number): void {
        if (address >= 0 && address < this.memory.length) {
            this.mar = address;
            this.log(`MAR set to: ${Hardware.hexLog(this.mar, 4)}`);
        } else {
            this.log(`Invalid MAR value: ${Hardware.hexLog(address, 4)}`);
        }
    }

    // Getter and setter for the Memory Data Register (MDR)
    public getMDR(): string {
        return this.mdr;
    }

    public setMDR(data: string): void {
        if (/^[0-9A-Fa-f]{1,2}$/.test(data)) { // Ensure data is a valid hex string
            this.mdr = data.toUpperCase().padStart(2, '0');
            this.log(`MDR set to: ${this.mdr}`);
        } else {
            this.log(`Invalid MDR value: ${data}`);
        }
    }

    // Display the contents of memory from address 0x00 to 0x14 (or another range)
    public displayMemory(start: number = 0x00, end: number = 0x14): void {
        for (let i = start; i <= end; i++) {
            let hexAddress = Hardware.hexLog(i, 4); // Convert the address to hex
            let value = this.memory[i] || 'ERR [hexValue conversion]: number undefined'; // Handle undefined values
            this.log(`Address: ${hexAddress} Contains Value: ${value}`); // Log the memory dump
        }
    }

    // Write a value to memory at a specific address
    public writeMemory(address: number, value: string): void {
        if (address < this.memory.length) {
            this.memory[address] = value.padStart(2, '0'); // Pad the value to ensure it's 2 hex digits
        } else {
            this.log(`Attempted to write to invalid memory address: ${Hardware.hexLog(address, 4)}`);
        }
    }

    // Read the value from memory at a specific address
    public readMemory(address: number): string {
        if (address < this.memory.length) {
            return this.memory[address]; // Return the value at the given memory address
        } else {
            this.log(`Attempted to read from invalid memory address: ${Hardware.hexLog(address, 4)}`);
            return 'ERR';
        }
    }
}
