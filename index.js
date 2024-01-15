"use strict";
/**
 *
 * solar heater system
 *
 */
var FluidSystemNodeType;
(function (FluidSystemNodeType) {
    FluidSystemNodeType["Node"] = "node";
    FluidSystemNodeType["SolarCollector"] = "solar-collector";
    FluidSystemNodeType["Pump"] = "pump";
    FluidSystemNodeType["Pipe"] = "pipe";
    FluidSystemNodeType["StorageTank"] = "storage-tank";
})(FluidSystemNodeType || (FluidSystemNodeType = {}));
class FluidSystemNode {
    constructor(type, name, fluidCapacity) {
        this.type = 'node';
        this.name = ''; //  let's assume these are all unique for now - @TODO use an id
        this.type = type;
        this.name = name;
        this.fluidCapacity = fluidCapacity;
        this.next = this;
    }
}
class SolarCollector extends FluidSystemNode {
    constructor(name, efficiency, metersSq, fluidCapacity) {
        super(FluidSystemNodeType.SolarCollector, name, fluidCapacity);
        this.efficiency = 0.25; //  0.0 = 1.0
        this.metersSq = 10; //   size of collector in m^2
        this.efficiency = efficiency;
        this.metersSq = metersSq;
    }
    area() {
        return this.metersSq;
    }
}
class Pump extends FluidSystemNode {
    constructor(name, flow, fluidCapacity) {
        super(FluidSystemNodeType.Pump, name, fluidCapacity);
        this.flow = 1.0; //  liters / min
        this.flow = flow;
    }
}
class Pipe extends FluidSystemNode {
    constructor(name, efficiency, fluidCapacity) {
        super(FluidSystemNodeType.Pipe, name, fluidCapacity);
        this.efficiency = 1.0; //  0.0 - 1.0
        this.efficiency = efficiency;
    }
}
class StorageTank extends FluidSystemNode {
    constructor(name, fluidCapacity) {
        super(FluidSystemNodeType.StorageTank, name, fluidCapacity);
    }
}
class ClosedFluidSystem {
    constructor(fluidDensity, systemEfficiency, fluidSpecificHeat, solarIrradiance) {
        this.fluidDensity = 998; //  kg/m^3
        this.systemEfficiency = 0.85; // Optional parameter with default value
        this.fluidSpecificHeat = 4186; // fluidSpecificHeat in J/kg°C (specific heat of water)
        this.solarIrradiance = 1000; // solarIrradiance in W/m² (peak sunlight)
        this.head = null;
        this.fluidDensity = fluidDensity;
        this.systemEfficiency = systemEfficiency !== null && systemEfficiency !== void 0 ? systemEfficiency : this.systemEfficiency;
        this.solarIrradiance = solarIrradiance !== null && solarIrradiance !== void 0 ? solarIrradiance : this.solarIrradiance;
    }
    insert(newNode) {
        if (this.head === null) {
            this.head = newNode;
            newNode.next = this.head;
        }
        else {
            let current = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            current.next = newNode;
            newNode.next = this.head;
        }
    }
    print() {
        if (!this.head)
            return;
        let current = this.head;
        let str = '';
        do {
            str = str + current.name + " -> ";
            current = current.next;
        } while (current !== this.head);
        console.log(str);
    }
    getSolarCollectors() {
        let nodes = [];
        if (!this.head)
            return nodes;
        let current = this.head;
        do {
            if (current.type === FluidSystemNodeType.SolarCollector) {
                nodes.push(current);
            }
            current = current.next;
        } while (current !== this.head);
        return nodes;
    }
    calculateMinimalPumpRate(temperatureRise) {
        let collectors = this.getSolarCollectors(); //  could be set up to return an array of them
        let energyAbsorbed = 0.0; //  watts
        collectors.forEach((collector) => {
            energyAbsorbed += (collector.area() * collector.efficiency * this.solarIrradiance);
        });
        // Calculate the energy required to achieve the desired temperature rise
        // Energy (Joules) = mass (kg) * specific heat capacity (J/kg°C) * temperature rise (°C)
        // Power (Watts) = Energy (Joules) / Time (seconds)
        // Flow rate (kg/s) = Power (Watts) / (specific heat capacity (J/kg°C) * temperature rise (°C))
        const flowRate = (energyAbsorbed * this.systemEfficiency) / (this.fluidSpecificHeat * temperatureRise);
        return flowRate; // Flow rate in kg/s (kilograms per second)
    }
    //  returns litres
    totalFluidVolume() {
        let totalFluidVolume = 0.0;
        if (!this.head)
            return totalFluidVolume;
        let current = this.head;
        do {
            if ('fluidCapacity' in current) {
                totalFluidVolume = totalFluidVolume + current.fluidCapacity;
                //console.log('totalFluidVolume ' + current.name, totalFluidVolume)
            }
            else {
                console.log('current is missing totalFluidVolume property');
            }
            current = current.next;
        } while (current !== this.head);
        return totalFluidVolume;
    }
    totalFluidMass() {
        let volume = this.totalFluidVolume() / 1000; //  convert litres to m^3
        let density = this.fluidDensity;
        let mass = volume * density;
        return mass;
    }
}
/**
 * Build the system through composition
 * adding nodes automatically attaches them to previous node
 * adding nodes automatically attaches them to the head node
 */
const SolarCollectorSystem = new ClosedFluidSystem(998, 0.85, 4186, 1000);
const collector = new SolarCollector('big collector', 1.0, 1000, 10.0);
SolarCollectorSystem.insert(collector);
const pipe1 = new Pipe('pipe_collector_to_pump', 1.0, 1.0);
SolarCollectorSystem.insert(pipe1);
const pump = new Pump('old pump', 1.0, 1.0);
SolarCollectorSystem.insert(pump);
const pipe2 = new Pipe('pipe_pump_to_tank', 1.0, 2.0);
SolarCollectorSystem.insert(pipe2);
const storageTank = new StorageTank('efficient tank', 500.0);
SolarCollectorSystem.insert(storageTank);
const pipe3 = new Pipe('pipe_tank_to_collector', 1.0, 5.0);
SolarCollectorSystem.insert(pipe3);
let totalSystemFluidCapacity = SolarCollectorSystem.totalFluidVolume();
console.log('totalSystemFluidVolume', totalSystemFluidCapacity);
let totalFluidMass = SolarCollectorSystem.totalFluidMass();
console.log('totalFluidMass', totalFluidMass);
SolarCollectorSystem.print();
//# sourceMappingURL=index.js.map