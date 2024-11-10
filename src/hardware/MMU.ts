// hardware/MMU.ts
import { Hardware } from './Hardware';
import { Memory } from './Memory';

export class MMU extends Hardware {
    private memory: Memory;

    constructor(id: number, memory: Memory) {
        super(id, 'MMU');
        this.memory = memory;
    }
       // Function to set the MAR using a single 16-bit address
       public setMAR(address: number): void {
        if (address >= 0 && address < 0x10000) {
            this.memory.setMAR(address);
            this.log(`MAR set to: ${Hardware.hexLog(address, 4)}`);
        } else {
            this.log(`Invalid MAR address: ${Hardware.hexLog(address, 4)}`);
        }
    }

    // Function to set the MAR using two single-byte addresses in little-endian format
    public setMARFromBytes(lowByte: number, highByte: number): void {
        if (lowByte >= 0x00 && lowByte <= 0xFF && highByte >= 0x00 && highByte <= 0xFF) {
            const address = (highByte << 8) | lowByte;
            this.setMAR(address);
        } else {
            this.log(`Invalid bytes for MAR: Low Byte - ${Hardware.hexLog(lowByte, 2)}, High Byte - ${Hardware.hexLog(highByte, 2)}`);
        }
    }

     // Method to set the MDR value
     public setMDR(data: string): void {
        this.memory.setMDR(data);
        this.log(`MDR set to: ${data}`);
    }


        // Function to write data from MDR to memory at the location specified by MAR
        public write(): void {
            this.memory.write();
        }

}