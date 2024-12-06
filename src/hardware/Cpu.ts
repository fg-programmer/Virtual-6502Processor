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

    private currentStep: number = 0; // Current pipeline step
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


    // Update Zero Flag
    private updateZeroFlag(value: number): void {
        this.zeroFlag = value === 0;
    }

    // Fetch the next byte from memory
    private fetchByte(): number {
        this.mmu.setMAR(this.pCounter);
        this.mmu.read();
        this.incrementPC();
        return parseInt(this.mmu.getMDR(), 16);
    }

    // Fetch two bytes and combine them into a 16-bit address
    private fetchAddress(): number {
        const lowByte = this.fetchByte();
        const highByte = this.fetchByte();
        return (highByte << 8) | lowByte;
    }

    // Fetch cycle
    private fetch(): void {
        this.instRegister = this.fetchByte();
        this.log(
            `Fetch: IR=${Hardware.hexLog(this.instRegister, 2)}, PC=${Hardware.hexLog(this.pCounter, 4)}`
        );
        this.currentOpcode = this.instRegister;
        this.currentStep++;
    }

        // Execute System Calls (SYS)
        private executeSysCall(): void {
            switch (this.xRegist) {
                case 0x01: // Print the integer in Y register
                    this.log(`SYS Call: Print integer ${this.yRegist}`);
                    break;
                case 0x02: 
                    const addr = this.yRegist;
                    this.log(`SYS Call: Print string from address ${Hardware.hexLog(addr, 4)}`);
                    this.StringFromMemory(addr);
                    break;
                case 0x03: 
                    const strAddr = this.fetchAddress();
                    this.log(`SYS Call: Print string from operand address ${Hardware.hexLog(strAddr, 4)}`);
                    this.StringFromMemory(strAddr);
                    break;
                default:
                    this.log(`SYS Call: Unrecognized SYS code ${Hardware.hexLog(this.xRegist, 2)}`);
                    break;
            }
        }

        private StringFromMemory(addr: number): void {
            let str = '';
            while (true) {
                this.mmu.setMAR(addr++);
                this.mmu.read();
                const charCode = parseInt(this.mmu.getMDR(), 16);
                if (charCode === 0x00) break;
                str += String.fromCharCode(charCode);
            }
            this.log(`Printed String: "${str}"`);
        }
    
    
    

    private decode(): void {
        this.log(`Decode: Opcode=${Hardware.hexLog(this.currentOpcode, 2)}`);
        switch (this.currentOpcode) {
            case 0xA9: // LDA #<constant>
                this.accumulator = this.fetchByte();
                this.updateZeroFlag(this.accumulator);
                this.log(`LDA Immediate: Acc=${Hardware.hexLog(this.accumulator, 2)}`);
                break;

            case 0xAD: // LDA $<low-byte> $<high-byte>
                const ldaAddr = this.fetchAddress();
                this.mmu.setMAR(ldaAddr);
                this.mmu.read();
                this.accumulator = parseInt(this.mmu.getMDR(), 16);
                this.updateZeroFlag(this.accumulator);
                this.log(`LDA Absolute: Addr=${Hardware.hexLog(ldaAddr, 4)}, Acc=${Hardware.hexLog(this.accumulator, 2)}`);
                break;

            case 0x8D: // STA $<low-byte> $<high-byte>
                const staAddr = this.fetchAddress();
                this.mmu.setMAR(staAddr);
                this.mmu.setMDR(Hardware.hexLog(this.accumulator, 2));
                this.mmu.write();
                this.log(`STA Absolute: Addr=${Hardware.hexLog(staAddr, 4)}, Data=${Hardware.hexLog(this.accumulator, 2)}`);
                break;

            case 0xA2: // LDX #<constant>
                this.xRegist = this.fetchByte();
                this.updateZeroFlag(this.xRegist);
                this.log(`LDX Immediate: X=${Hardware.hexLog(this.xRegist, 2)}`);
                break;
    
            case 0x8A: // TXA
                this.accumulator = this.xRegist;
                this.updateZeroFlag(this.accumulator);
                break;
                
            case 0x98: // TYA
                this.accumulator = this.yRegist;
                this.updateZeroFlag(this.accumulator);
                break;
    
            case 0x6D: // ADC $<low-byte> $<high-byte>
                const adcAddr = this.fetchAddress();
                this.mmu.setMAR(adcAddr);
                this.mmu.read();
                const value = parseInt(this.mmu.getMDR(), 16);
                this.accumulator = (this.accumulator + value) & 0xFF;
                this.updateZeroFlag(this.accumulator);
                break;

            case 0xA2: // LDX #<constant>
                this.xRegist = this.fetchByte();
                this.updateZeroFlag(this.xRegist);
                break;
    
            case 0xAE: // LDX $<low-byte> $<high-byte>
                const ldxAddr = this.fetchAddress();
                this.mmu.setMAR(ldxAddr);
                this.mmu.read();
                this.xRegist = parseInt(this.mmu.getMDR(), 16);
                this.updateZeroFlag(this.xRegist);
                break;

            case 0xAA: // TAX
                this.xRegist = this.accumulator;
                this.updateZeroFlag(this.xRegist);
                break;

            case 0xA0: // LDY #<constant>
                this.yRegist = this.fetchByte();
                this.updateZeroFlag(this.yRegist);
                break;
    
            case 0xAC: // LDY $<low-byte> $<high-byte>
                const ldyAddr = this.fetchAddress();
                this.mmu.setMAR(ldyAddr);
                this.mmu.read();
                this.yRegist = parseInt(this.mmu.getMDR(), 16);
                this.updateZeroFlag(this.yRegist);
                break;

            case 0xA8: // TAY
                this.yRegist = this.accumulator;
                this.updateZeroFlag(this.yRegist);
                break;
    
    
            case 0xEC: // CPX $<low-byte> $<high-byte>
            const cpxAddr = this.fetchAddress();
                this.mmu.setMAR(cpxAddr);
                this.mmu.read();
                const compVal = parseInt(this.mmu.getMDR(), 16);
                this.updateZeroFlag(this.xRegist === compVal ? 0 : 1);
            break;

            case 0xD0: // BNE <offset>
                const offset = this.fetchByte();
                if (!this.zeroFlag) {
                    this.pCounter = (this.pCounter + (offset < 0x80 ? offset : offset - 0x100)) & 0xFFFF;
                }
                break;

            case 0xEE: // INC $<low-byte> $<high-byte>
                const incAddy = this.fetchAddress();
                this.mmu.setMAR(incAddy);
                this.mmu.read();
                const incValue = parseInt(this.mmu.getMDR(), 16);
                this.mmu.setMDR(Hardware.hexLog((incValue + 1) & 0xFF, 2));
                this.mmu.write();
                break;

            case 0xFF: // SYS
                this.executeSysCall();
                break;

            case 0x00: // BRK
                this.log('BRK: Program stopped');
                break;
    
            default: // Unrecognized opcode
                this.log(`Not real instruction: ${Hardware.hexLog(this.currentOpcode, 2)}`);
                this.currentStep = 4; // Skip remaining steps
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
            this.currentStep++; // Move to writeBack
        }
    }    
    private writeBack(): void {
        if (this.currentOpcode === 0xEE) { // INC
            this.mmu.pulse(); // Write operation completes
            this.log('WriteBack done');
        }
        this.currentStep++; // Move to interruptCheck
    }
    private interruptCheck(): void {
        this.log('Interrupt check ');
        this.currentStep = 0; // Return to fetch
    }

    public pulse(): void {
        switch (this.currentStep) {
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
                this.currentStep = 0; // Reset to fetch
        }
    }


    
}
