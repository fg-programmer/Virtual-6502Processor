# tsiraM-6502

tsiraM is a virtual 6502 processor written in TypeScript and running on Node.js. This project is the practical component of Prof. Gormanly's Computer Organization and Architecture class. This project strives to accomplish the following goals:

* A deep understanding of how the machine works. There is no better way to learn how computers actually work than to build one!
* You become a high level master of code by using OOP to create a virtual machine
* You become a low level ninja, creating programs in machine instructions to run on your creation! Enriching your understanding of the world below your compiler.
* Your design and debugging skills are pushed to solve problems that will melt your brain. You will debug machine level code you write on a machine you built!

## What does tsiraM mean?

The project needed a name, I like WebOS since this project is built on web technologies and the long term plan is to use this VM as the basis for a Operating Systems project. In that project you will build an OS that can run on this VM. Unfortunately, while the name WebOS makes sense for these reasons, I do not like talking to Lawyers so I have decided to use tsiraM instead. tsiraM is something I bought the .dot com for a while ago and have not gotten around to using it for anything. If it makes no sense, keep trying, I left a clue. The 'M' might stand for Microarchitecture, or maybe not. I wonder if the lawyers will come anyway? Regardless this is a good name until something better comes along. Maybe SObeW instead?

## Features

* **6502 CPU emulation** — register set (accumulator, X/Y index registers, program counter, stack pointer, status flags) and a fetch-decode-execute instruction cycle
* **Clock-driven architecture** — a central system clock pulses on every cycle, and hardware components subscribe as listeners to stay in sync
* **Memory subsystem** — simulated RAM with a Memory Management Unit (MMU) mediating address translation between the CPU and physical memory
* **Interrupt handling** — an interrupt controller and interrupt object model allow hardware devices to signal the CPU asynchronously
* **Keyboard device** — a simulated input device that raises interrupts to deliver keystrokes to the system
* **ASCII support** — character encoding/decoding utilities for I/O between hardware and human-readable output
* **System orchestration** — a top-level `System` class wires all hardware components together and boots the virtual machine

## Project Structure

```
Virtual-6502Processor/
└── src/
    ├── hardware/
    │   ├── imp/
    │   │   └── ClockListener.ts      # Interface/abstract contract for components that react to clock pulses
    │   ├── ASCII.ts                  # ASCII character table / encoding utilities
    │   ├── Clock.ts                  # System clock — pulses that drive the CPU and other hardware each cycle
    │   ├── Cpu.ts                    # 6502 CPU — registers, fetch/decode/execute instruction cycle
    │   ├── Hardware.ts               # Base class shared by all hardware components (naming, logging, common behavior)
    │   ├── Interrupt.ts              # Interrupt object model
    │   ├── InterruptController.ts    # Queues and dispatches interrupts to the CPU
    │   ├── Keyboard.ts               # Keyboard input device — generates keyboard interrupts
    │   ├── MMU.ts                    # Memory Management Unit — address translation between CPU and Memory
    │   └── Memory.ts                 # RAM simulation — MAR/MDR-style read/write operations
    └── System.ts                     # Top-level entry point — instantiates and wires hardware together, boots the VM
```

## Architecture

At a high level, the system is built around a clock-driven, hardware-component model:

1. **Boot** — `System.ts` instantiates the CPU, Memory, MMU, Clock, Interrupt Controller, and Keyboard, and wires them together.
2. **Clock pulses** — `Clock.ts` ticks on an interval and notifies every subscribed component through the `ClockListener` contract (`hardware/imp/ClockListener.ts`).
3. **CPU cycle** — on each pulse, `Cpu.ts` fetches the next instruction (via the `MMU.ts`/`Memory.ts` pipeline), decodes it according to the 6502 instruction set, and executes it, updating registers and flags.
4. **Memory access** — all CPU reads/writes to memory are routed through `MMU.ts`, which mediates addressing before touching `Memory.ts`.
5. **Interrupts** — devices like `Keyboard.ts` raise interrupts, represented by `Interrupt.ts` objects, which are queued and routed to the CPU by `InterruptController.ts`. The CPU checks for pending interrupts as part of its cycle and services them according to priority.
6. **I/O** — `ASCII.ts` provides the character encoding needed to translate between raw byte values in memory and human-readable text for console/keyboard I/O.

## Tech Stack

* **Language:** TypeScript
* **Runtime:** Node.js (server-side, not browser-based)

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) and npm
* TypeScript (`npm install -g typescript`, or as a project dependency)

### Setup

```bash
git clone https://github.com/<your-org>/Virtual-6502Processor.git
cd Virtual-6502Processor

# Install dependencies
npm install

# Compile TypeScript to JavaScript
tsc
```

### Running

```bash
node dist/System.js
```

(Adjust the entry-point path to match your actual compiled output directory/filename.)

## Credits

This software is an adaptation of a project created by [Dr. Alan Labouseur's](http://labouseur.com/courses/os/) for his Operating Systems (CMPT 424) course project. That project builds a very cool operating system on top of a rudimentary virtual 6502 CPU. This project focuses on building a robust and complete 6502 architecture and instruction set. You will be creating a 6502 emulator programmed using TypeScript that will run on server side JavaScript in Node.js. Here are references to Dr. Labouseur's original projects:

* 2019 version: https://github.com/AlanClasses/TSOS-2019
* 2015-2018 version: https://github.com/AlanClasses/TSOS
