import { test, expect, describe, beforeEach } from "bun:test";
import {ClosedFluidSystem, FluidSystemNode, SolarCollector, Pipe} from './index.ts';

describe('ClosedFluidSystem', () : void => {
    let system;

    beforeEach(() : void => {
        system = new ClosedFluidSystem(998, 4186, 1000);
    });

    test('insert', () : void => {
        const node = new FluidSystemNode('node', 'test', 1);
        system.insert(node);
        expect(system.head).toBe(node);
    });

    test('getSolarCollectors', () : void => {
        const collector = new SolarCollector('collector', 0.25, 10, 1);
        system.insert(collector);
        expect(system.getSolarCollectors()).toEqual([collector]);
    });

    test('calculatePumpSpeed', () : void => {
        const collector = new SolarCollector('collector', 0.25, 10, 1);
        system.insert(collector);
        expect(system.calculatePumpSpeed(10)).toEqual(3.590554257104749);
    });

    test('totalFluidVolume', () : void => {
        const pipe = new Pipe('pipe', 1);
        system.insert(pipe);
        expect(system.totalFluidVolume()).toBe(1);
    });

    test('totalFluidMass', () : void => {
        const pipe = new Pipe('pipe', 1000);
        system.insert(pipe);
        expect(system.totalFluidMass()).toBe(998);
    });
});