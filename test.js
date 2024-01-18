const { ClosedFluidSystem, FluidSystemNode, SolarCollector, Pipe, Pump, StorageTank } = require('./index.ts');

describe('ClosedFluidSystem', () => {
    let system;

    beforeEach(() => {
        system = new ClosedFluidSystem(998, 4186, 1000);
    });

    test('insert', () => {
        const node = new FluidSystemNode('node', 'test', 1);
        system.insert(node);
        expect(system.head).toBe(node);
    });

    test('print', () => {
        const node = new FluidSystemNode('node', 'test', 1);
        system.insert(node);
        console.log = jest.fn();
        system.print();
        expect(console.log).toHaveBeenCalledWith('test -> test -> ');
    });

    test('getSolarCollectors', () => {
        const collector = new SolarCollector('collector', 0.25, 10, 1);
        system.insert(collector);
        expect(system.getSolarCollectors()).toEqual([collector]);
    });

    test('calculatePumpSpeed', () => {
        const collector = new SolarCollector('collector', 0.25, 10, 1);
        system.insert(collector);
        expect(system.calculatePumpSpeed(10)).toBeCloseTo(0.6, 2);
    });

    test('totalFluidVolume', () => {
        const pipe = new Pipe('pipe', 1);
        system.insert(pipe);
        expect(system.totalFluidVolume()).toBe(1);
    });

    test('totalFluidMass', () => {
        const pipe = new Pipe('pipe', 1000);
        system.insert(pipe);
        expect(system.totalFluidMass()).toBe(998);
    });
});