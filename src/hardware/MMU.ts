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

        // Function to write a static program into memory
        public writeImmediate(): void {
        const program = [
            { address: 0x0000, data: 'A9' },
            { address: 0x0001, data: '0D' },
            { address: 0x0002, data: 'A9' },
            { address: 0x0003, data: '1D' },
            { address: 0x0004, data: 'A9' },
            { address: 0x0005, data: '2D' },
            { address: 0x0006, data: 'A9' },
            { address: 0x0007, data: '3F' },
            { address: 0x0008, data: 'A9' },
            { address: 0x0009, data: 'FF' },
            { address: 0x000A, data: '00' },
            { address: 0x000B, data: '00' },
            { address: 0x000C, data: '00' },
            { address: 0x000D, data: '00' },
            { address: 0x000E, data: '00' },
            { address: 0x000F, data: '00' }
        ];
        
        for (let entry of program) {
            this.setMAR(entry.address);
            this.setMDR(entry.data);
            this.write();
        }
        this.memoryDump(0x0000, 0x000F); // Call to dump memory content after program load
    }

    // Memory dump method to display memory content from start to end address
    private memoryDump(startAddress: number, endAddress: number): void {
        this.log('Memory Dump: Debug');
        this.log('--------------------------------------');

        for (let addr = startAddress; addr <= endAddress; addr++) {
            this.setMAR(addr);
            this.memory.read();
            const value = this.memory.getMDR();
            this.log(`Addr ${Hardware.hexLog(addr, 4)}: | ${value}`);
        }
        this.log('--------------------------------------');
        this.log('Memory Dump: Complete');
    }
    

}