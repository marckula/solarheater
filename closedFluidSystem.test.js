"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const { ClosedFluidSystem, FluidSystemNode, SolarCollector, Pipe, Pump, StorageTank } = require('./index.ts');
(0, bun_test_1.describe)('ClosedFluidSystem', () => {
    let system;
    // beforeEach(() : void => {
    //     system = new ClosedFluidSystem(998, 4186, 1000);
    // });
    (0, bun_test_1.test)('insert', () => {
        const node = new FluidSystemNode('node', 'test', 1);
        let system = new ClosedFluidSystem(998, 4186, 1000);
        system.insert(node);
        (0, bun_test_1.expect)(system.head).toBe(node);
    });
    (0, bun_test_1.test)('print', () => {
        const node = new FluidSystemNode('node', 'test', 1);
        let system = new ClosedFluidSystem(998, 4186, 1000);
        system.insert(node);
        console.log = bun_test_1.jest.fn();
        system.print();
        (0, bun_test_1.expect)(console.log).toHaveBeenCalledWith('test -> test -> ');
    });
    (0, bun_test_1.test)('getSolarCollectors', () => {
        const collector = new SolarCollector('collector', 0.25, 10, 1);
        let system = new ClosedFluidSystem(998, 4186, 1000);
        system.insert(collector);
        (0, bun_test_1.expect)(system.getSolarCollectors()).toEqual([collector]);
    });
    (0, bun_test_1.test)('calculatePumpSpeed', () => {
        const collector = new SolarCollector('collector', 0.25, 10, 1);
        let system = new ClosedFluidSystem(998, 4186, 1000);
        system.insert(collector);
        (0, bun_test_1.expect)(system.calculatePumpSpeed(10)).toBeCloseTo(0.6, 2);
    });
    (0, bun_test_1.test)('totalFluidVolume', () => {
        const pipe = new Pipe('pipe', 1);
        let system = new ClosedFluidSystem(998, 4186, 1000);
        system.insert(pipe);
        (0, bun_test_1.expect)(system.totalFluidVolume()).toBe(1);
    });
    (0, bun_test_1.test)('totalFluidMass', () => {
        const pipe = new Pipe('pipe', 1000);
        let system = new ClosedFluidSystem(998, 4186, 1000);
        system.insert(pipe);
        (0, bun_test_1.expect)(system.totalFluidMass()).toBe(998);
    });
});
//# sourceMappingURL=closedFluidSystem.test.js.map