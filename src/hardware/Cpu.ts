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
    private carryFlag: number = 0; // C flag (0 or 1)

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
        this.pCounter = (this.pCounter + 1) & 0xFFFF; 
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
        switch (this.currentOpcode) {
            case 0xA9: // LDA #<constant>
                // Immediate value already fetched during decode; nothing to do.
                this.log("Execute: LDA Immediate - No additional execution needed");
                break;
    
            case 0xAD: // LDA $<low-byte> $<high-byte>
                this.log("Execute: LDA Absolute - No additional execution needed");
                break;
    
            case 0x8D: // STA $<low-byte> $<high-byte>
                this.log("Execute: STA Absolute - No additional execution needed");
                break;
    
            case 0xA2: // LDX #<constant>
            case 0xAE: // LDX $<low-byte> $<high-byte>
                this.log("Execute: LDX - No additional execution needed");
                break;
    
            case 0x8A: // TXA
                this.log("Execute: TXA - No additional execution needed");
                break;
    
            case 0x98: // TYA
                this.log("Execute: TYA - No additional execution needed");
                break;
    
            case 0x6D: // ADC $<low-byte> $<high-byte>
                this.log("Execute: ADC - No additional execution needed");
                break;
    
            case 0xAA: // TAX
                this.log("Execute: TAX - No additional execution needed");
                break;
    
            case 0xA0: // LDY #<constant>
            case 0xAC: // LDY $<low-byte> $<high-byte>
                this.log("Execute: LDY - No additional execution needed");
                break;
    
            case 0xA8: // TAY
                this.log("Execute: TAY - No additional execution needed");
                break;
    
            case 0xEC: // CPX $<low-byte> $<high-byte>
                this.log("Execute: CPX - No additional execution needed");
                break;
    
            case 0xD0: // BNE <offset>
                // Conditional branch logic already applied during decode.
                this.log("Execute: BNE - No additional execution needed");
                break;

            case 0x6D: // ADC $<low-byte> $<high-byte>
                const fetchedValue = parseInt(this.mmu.getMDR(), 16); // Value from memory
                const result = this.accumulator + fetchedValue + this.carryFlag; // Carry is numeric

                this.accumulator = result & 0xFF; // Wrap to 8-bit
                this.carryFlag = (result > 0xFF) ? 1 : 0; // Update carry as 1 or 0
                this.updateZeroFlag(this.accumulator); // Update zero flag

                this.log(
                `ADC: Fetched=${Hardware.hexLog(fetchedValue, 2)}, CarryIn=${this.carryFlag}, ` +
                `Result=${Hardware.hexLog(this.accumulator, 2)}, CarryOut=${this.carryFlag}`
                );
                break;

    
            case 0xEE: // INC $<low-byte> $<high-byte>
                // Memory read for increment completed in decode; now increment the value.
                const data = parseInt(this.mmu.getMDR(), 16);
                const incremented = (data + 1) & 0xFF; // Increment value with wrapping.
                this.mmu.setMDR(Hardware.hexLog(incremented, 2));
                this.mmu.write(); // Write back incremented value.
                this.log(`Execute: INC - Incremented value to ${Hardware.hexLog(incremented, 2)}`);
                break;
    
            case 0xFF: // SYS
                // System call execution was performed during decode.
                this.log("Execute: SYS - No additional execution needed");
                break;
    
            case 0x00: // BRK
                // Stop instruction execution; handled during decode.
                this.log("Execute: BRK - No additional execution needed");
                break;
    
            default: // Unrecognized opcode
                this.log(`Execute: Unrecognized Opcode - No execution performed`);
                break;
        }
        this.currentStep++; // Proceed to the next pipeline step (writeBack or interruptCheck).
    }


    private writeBack(): void {
            switch (this.currentOpcode) {
                case 0xA9: // LDA #<constant>
                case 0xAD: // LDA $<low-byte> $<high-byte>
                    // Accumulator is already updated in decode; nothing further to write back.
                    this.log("WriteBack: LDA - No additional write-back needed");
                    break;
        
                case 0x8D: // STA $<low-byte> $<high-byte>
                    this.log("WriteBack: STA - No additional write-back needed");
                    break;
        
                case 0xA2: // LDX #<constant>
                case 0xAE: // LDX $<low-byte> $<high-byte>
                    this.log("WriteBack: LDX - No additional write-back needed");
                    break;
        
                case 0x8A: // TXA
                    this.log("WriteBack: TXA - No additional write-back needed");
                    break;
        
                case 0x98: // TYA
                    this.log("WriteBack: TYA - No additional write-back needed");
                    break;
        
                case 0x6D: // ADC $<low-byte> $<high-byte>
                    this.log("WriteBack: ADC - No additional write-back needed");
                    break;
        
                case 0xAA: // TAX
                    this.log("WriteBack: TAX - No additional write-back needed");
                    break;
        
                case 0xA0: // LDY #<constant>
                case 0xAC: // LDY $<low-byte> $<high-byte>
                    this.log("WriteBack: LDY - No additional write-back needed");
                    break;
        
                case 0xA8: // TAY
                    this.log("WriteBack: TAY - No additional write-back needed");
                    break;
        
                case 0xEC: // CPX $<low-byte> $<high-byte>
                    this.log("WriteBack: CPX - No additional write-back needed");
                    break;
        
                case 0xD0: // BNE <offset>
                    this.log("WriteBack: BNE - No additional write-back needed");
                    break;
        
                case 0xEE: // INC $<low-byte> $<high-byte>
                    this.log("WriteBack: INC - No additional write-back needed");
                    break;
        
                case 0xFF: // SYS
                    this.log("WriteBack: SYS - No additional write-back needed");
                    break;
        
                case 0x00: // BRK
                    this.log("WriteBack: BRK - No additional write-back needed");
                    break;
        
                default: // Unrecognized opcode
                    this.log("WriteBack: Unrecognized Opcode - No write-back performed");
                    break;
            }
            this.currentStep = 0; // Reset the pipeline for the next instruction.
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
