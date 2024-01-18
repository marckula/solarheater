/**
 *
 * solar heater system
 *
 */

enum FluidSystemNodeType {
    Node = 'node',
    SolarCollector = 'solar-collector',
    Pump = 'pump',
    Pipe = 'pipe',
    StorageTank = 'storage-tank'
}
export class FluidSystemNode {
    type: string = 'node'
    name: string = ''
    fluidCapacity: number   // litres
    next: FluidSystemNode   //  pointer

    constructor(type: string, name: string, fluidCapacity: number) {
        this.type = type
        this.name = name
        this.fluidCapacity = fluidCapacity
        this.next = this
    }
}

export class SolarCollector extends FluidSystemNode {

    efficiency : number = 0.25     //  0.0 = 1.0
    metersSq = 10      //   size of collector in m^2

    constructor(name: string, efficiency: number, metersSq: number, fluidCapacity: number) {
        super(FluidSystemNodeType.SolarCollector, name, fluidCapacity)
        this.efficiency = efficiency
        this.metersSq = metersSq
    }
}

export class Pump extends FluidSystemNode {

    flow: number = 1.0              //  liters / min

    constructor(name: string, flow: number, fluidCapacity: number) {
        super(FluidSystemNodeType.Pump, name, fluidCapacity)
        this.flow = flow
    }
}

export class Pipe extends FluidSystemNode {

    constructor(name: string, fluidCapacity: number) {
        super(FluidSystemNodeType.Pipe, name, fluidCapacity)
        console.log(FluidSystemNodeType.Pipe, this)

    }

}

export class StorageTank extends FluidSystemNode {
    constructor(name: string, fluidCapacity: number) {
        super(FluidSystemNodeType.StorageTank, name, fluidCapacity)
        console.log(FluidSystemNodeType.StorageTank, this)
    }
}

export class ClosedFluidSystem {

    head: FluidSystemNode | null

    fluidDensity: number = 998          //  kg/m^3
    fluidSpecificHeat: number = 4186    // fluidSpecificHeat in J/kg°C (specific heat of water)
    solarIrradiance: number = 1000      // solarIrradiance in W/m² (peak sunlight)

    constructor(fluidDensity: number, fluidSpecificHeat: number, solarIrradiance: number) {
        this.head = null;
        this.fluidDensity = fluidDensity
        this.solarIrradiance = solarIrradiance ?? this.solarIrradiance
        this.fluidSpecificHeat = fluidSpecificHeat ?? this.fluidSpecificHeat
        console.log('Closed Fluid System', this)
    }

    insert(newNode: FluidSystemNode): void {

        if (this.head === null) {
            this.head = newNode;
            newNode.next = this.head;
        } else {
            let current : FluidSystemNode = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            current.next = newNode;
            newNode.next = this.head;
        }
    }

    print(): void {
        if (!this.head)
            return

        let current : FluidSystemNode = this.head
        let str : string = ''
        do {
            str = str + current.name + " -> "
            current = current.next
        } while (current !== this.head)

        console.log(str)
    }

    getSolarCollectors() : SolarCollector[] {
        let nodes: SolarCollector[] = [];

        if (!this.head)
            return nodes;

        let current: FluidSystemNode = this.head;

        do {
            if (current.type === FluidSystemNodeType.SolarCollector){
                nodes.push(current as SolarCollector);
            }

            current = current.next;
        } while (current !== this.head);

        return nodes;
    }

    calculatePumpSpeed(targetTemperatureRiseC: number): number {
        // Calculate the total energy absorbed by the solar collectors
        let collectors: SolarCollector[] = this.getSolarCollectors();
        let totalEnergyAbsorbed: number = 0.0;   //  watts
        collectors.forEach((collector: SolarCollector) => {
            totalEnergyAbsorbed += collector.metersSq * collector.efficiency * this.solarIrradiance;
        });

        // Calculate the flow rate required to achieve the target temperature rise
        let flowRate: number = totalEnergyAbsorbed / (this.fluidSpecificHeat * targetTemperatureRiseC);

        // Convert the flow rate from kg/s to L/min (since the pump speed is usually measured in L/min)
        let pumpSpeed: number = flowRate * 60 * 1000 / this.fluidDensity;

        return pumpSpeed;
    }

    //  returns litres
    totalFluidVolume(): number {

        let totalFluidVolume: number = 0.0

        if (!this.head)
            return totalFluidVolume

        let current : FluidSystemNode = this.head;

        do {
            if ('fluidCapacity' in current) {
                totalFluidVolume = totalFluidVolume + current.fluidCapacity
            }
            else {
                console.log('current is missing totalFluidVolume property')
            }

            current = current.next

        } while (current !== this.head)

        return totalFluidVolume
    }

    totalFluidMass(): number {
        let volume : number = this.totalFluidVolume() / 1000    //  convert litres to m^3
        let density : number = this.fluidDensity
        return volume * density
    }

}



/**
 * Build the system through composition
 * adding nodes automatically attaches them to previous node
 * adding nodes automatically attaches them to the head node
 */

const SolarCollectorSystem: ClosedFluidSystem = new ClosedFluidSystem(998, 4186, 1000)

const collector: SolarCollector = new SolarCollector('big collector', .25, 200, 300.0)
SolarCollectorSystem.insert(collector)

const pipe1: Pipe = new Pipe('pipe_collector_to_pump', 1.0)
SolarCollectorSystem.insert(pipe1)

const pump: Pump = new Pump('old pump', 1.0, 1.0)
SolarCollectorSystem.insert(pump);

const pipe2: Pipe = new Pipe('pipe_pump_to_tank', 2.0)
SolarCollectorSystem.insert(pipe2)

const storageTank: StorageTank = new StorageTank('efficient tank', 500.0)
SolarCollectorSystem.insert(storageTank);

const pipe3: Pipe = new Pipe('pipe_tank_to_collector', 5.0)
SolarCollectorSystem.insert(pipe3)

let totalSystemFluidCapacity: number = SolarCollectorSystem.totalFluidVolume()
console.log('totalSystemFluidVolume (L)', totalSystemFluidCapacity)

let totalFluidMass: number = SolarCollectorSystem.totalFluidMass()
console.log('totalFluidMass (kg)', totalFluidMass)

let minimalPumpRate: number = SolarCollectorSystem.calculatePumpSpeed(10)   // temperatureRise in °C
console.log('minimalPumpRate (L/min)', minimalPumpRate)

SolarCollectorSystem.print()

