// hardware/Hardware.ts
export class Hardware {
    private static idCounter: number = 0;
    protected id: number;
    protected name: string;
    protected debug: boolean;

    constructor(id: number, name: string) {
        this.id = Hardware.idCounter++;
        this.name = name;
        this.debug = true; // Debugging is on by default
    }

    // Log method for subclasses to call
    public log(message: string): void {
        if (this.debug) {
            const timestamp = Date.now();
            console.log(`[HW - ${this.name} id: ${this.id} - ${timestamp}]: ${message}`);
        } else {
            console.error(`[HW - ${this.name} id: ${this.id}]: LOGGING DISABLED`);
        }
    }

    // Function to format a number as a hexadecimal string
    public static hexLog(value: number, length = 2): string {
        if (value === undefined) {
            return "ERR [hexValue conversion]: number undefined";
        }
        const hexString = value.toString(16).toUpperCase();
        return hexString.padStart(length, "0");
    }
}
