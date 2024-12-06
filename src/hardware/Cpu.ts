// hardware/Cpu.ts
import { Hardware } from './Hardware';
import { MMU } from './MMU';


export class CPU extends Hardware {
    private accumulator: number = 0x00; // A
    private pCounter: number = 0x0000; // PC
    private xRegist: number = 0x00; // X
    private yRegist: number = 0x00; // Y
    private instRegister: number = 0x00; // IR
    private zeroFlag: boolean = false; // Z flag

    private currentstep: number = 0; // Current pipeline step
    private currentOpcode: number | null = null; // Current opcode being executed

    private mmu: MMU; // Memory Management Unit

    constructor(id: number, mmu: MMU) {
        super(id, 'CPU');
        this.mmu = mmu;
        this.log('CPU initialized');
    }

    // Getter for the current PC
    public getPC(): number {
        return this.pCounter;
    }

    // Increment the PC
    private incrementPC(): void {
        this.pCounter = (this.pCounter + 1) & 0xFFFF; // Wraps at 16-bit boundary
    }


    private fetch(): void {
        this.mmu.setMAR(this.pCounter);
        this.mmu.read();
        this.mmu.pulse();
        this.currentOpcode = parseInt(this.mmu.getMDR(), 16);
        this.incrementPC();
        this.log(`Opcode: ${Hardware.hexLog(this.currentOpcode, 2)}`);
        this.currentstep++; // Move to decode
    }

    private decode(): void {
        if (this.currentOpcode === 0xEA) { 
            this.log('Decoded NOP');
            this.currentstep = 4; // Skip execute for interrupt check
        } else if (this.currentOpcode === 0xEE) { // INC
            this.log('Decoded INC');
            this.currentstep++; // Move to execute
        } else {
            this.log('Not real instruction');
            this.currentstep = 4; // Skip remaining steps
        }
    }
}
