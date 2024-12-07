class Ascii {
    // Converts a character to its ASCII byte
    static charToByte(char: string): number {
        const byte = char.charCodeAt(0);
        return byte;
    }

    // Converts an ASCII byte to its corresponding character
    static byteToChar(byte: number): string {
        const char = String.fromCharCode(byte);
        return char;
    }

    // Converts a string to an array of ASCII bytes
    static stringToBytes(input: string): number[] {
        const bytes: number[] = [];
        for (let i = 0; i < input.length; i++) {
            bytes.push(this.charToByte(input[i]));
        }
        return bytes;
    }

    // Converts an array of ASCII bytes back to a string
    static bytesToString(bytes: number[]): string {
        let result = '';
        for (const byte of bytes) {
            result += this.byteToChar(byte);
        }
        return result;
    }
}
