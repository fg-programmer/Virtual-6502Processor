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
        switch (this.currentOpcode) {
            case 0xA9: // LDA #<constant>
                this.log('Decoded LDA (Immediate)');
                this.currentstep++; // Move to execute
                break;
    
            case 0xAD: // LDA $<low-byte> $<high-byte>
                this.log('Decoded LDA (Absolute)');
                this.currentstep++; // Move to execute
                break;
    
            case 0x8D: // STA $<low-byte> $<high-byte>
                this.log('Decoded STA (Absolute)');
                this.currentstep++; // Move to execute
                break;
    
            case 0x8A: // TXA
                this.log('Decoded TXA');
                this.currentstep++; // Move to execute
                break;
    
            case 0x98: // TYA
                this.log('Decoded TYA');
                this.currentstep++; // Move to execute
                break;
    
            case 0x6D: // ADC $<low-byte> $<high-byte>
                this.log('Decoded ADC (Absolute)');
                this.currentstep++; // Move to execute
                break;
    
            case 0xA2: // LDX #<constant>
                this.log('Decoded LDX (Immediate)');
                this.currentstep++; // Move to execute
                break;
    
            case 0xAE: // LDX $<low-byte> $<high-byte>
                this.log('Decoded LDX (Absolute)');
                this.currentstep++; // Move to execute
                break;
    
            case 0xAA: // TAX
                this.log('Decoded TAX');
                this.currentstep++; // Move to execute
                break;
    
            case 0xA0: // LDY #<constant>
                this.log('Decoded LDY (Immediate)');
                this.currentstep++; // Move to execute
                break;
    
            case 0xAC: // LDY $<low-byte> $<high-byte>
                this.log('Decoded LDY (Absolute)');
                this.currentstep++; // Move to execute
                break;
    
            case 0xA8: // TAY
                this.log('Decoded TAY');
                this.currentstep++; // Move to execute
                break;
    
    
            case 0xEC: // CPX $<low-byte> $<high-byte>
                this.log('Decoded CPX (Absolute)');
                this.currentstep++; // Move to execute
                break;
    
            case 0xD0: // BNE <offset>
                this.log('Decoded BNE');
                this.currentstep++; // Move to execute
                break;
    
            case 0xEE: // INC $<low-byte> $<high-byte>
                this.log('Decoded INC (Absolute)');
                this.currentstep++; // Move to execute
                break;
    
            case 0xFF: // SYS
                this.log('Decoded SYS');
                this.currentstep++; // Move to execute
                break;
    
            case 0x00: // BRK
                this.log('Decoded BRK');
                this.currentstep++; // Move to execute
                break;
    
            default: // Unrecognized opcode
                this.log(`Not real instruction: ${Hardware.hexLog(this.currentOpcode, 2)}`);
                this.currentstep = 4; // Skip remaining steps
                break;
        }
    }
    private execute(): void {
        if (this.currentOpcode === 0xEE) { 
            this.mmu.read(); // Get data from memory
            this.mmu.pulse();
            const data = parseInt(this.mmu.getMDR(), 16);
            const incremented = (data + 1) & 0xFF; // Increment 
            this.mmu.setMDR(Hardware.hexLog(incremented, 2));
            this.mmu.write();
            this.currentstep++; // Move to writeBack
        }
    }    
    private writeBack(): void {
        if (this.currentOpcode === 0xEE) { // INC
            this.mmu.pulse(); // Write operation completes
            this.log('WriteBack done');
        }
        this.currentstep++; // Move to interruptCheck
    }
    private interruptCheck(): void {
        this.log('Interrupt check ');
        this.currentstep = 0; // Return to fetch
    }

    public pulse(): void {
        switch (this.currentstep) {
            case 0:
                this.fetch();
                break;
            case 1:
                this.decode();
                break;
            case 2:
                this.execute();
                break;
            case 3:
                this.writeBack();
                break;
            case 4:
                this.interruptCheck();
                break;
            default:
                this.currentstep = 0; // Reset to fetch
        }
    }


    case 0xA9: // LDA #<constant>
    this.accumulator = parseInt(this.fetchOperand(), 16);
    this.updateZeroFlag(this.accumulator);
    this.log(`LDA #$${Hardware.hexLog(this.accumulator, 2)}`);
    break;

case 0xAD: // LDA $<low-byte> $<high-byte>
    const ldaAddr = this.fetchAddress();
    this.accumulator = this.readMemory(ldaAddr);
    this.updateZeroFlag(this.accumulator);
    this.log(`LDA $${Hardware.hexLog(ldaAddr, 4)} = ${Hardware.hexLog(this.accumulator, 2)}`);
    break;

    
}
