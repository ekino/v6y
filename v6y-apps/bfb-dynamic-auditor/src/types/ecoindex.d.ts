declare module 'ecoindex' {
    export function computeEcoIndex(dom: number, req: number, size: number): number;
    export function getEcoIndexGrade(ecoIndex: number): string | false;
    export function computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex: number): string;
    export function computeWaterConsumptionfromEcoIndex(ecoIndex: number): string;
}
