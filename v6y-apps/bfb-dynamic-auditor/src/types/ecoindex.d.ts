declare module 'ecoindex' {
    export function computeEcoIndex(dom: number, req: number, size: number): number;
    export function computeQuantile(quantiles: number[], value: number): number;
    export function getEcoIndexGrade(ecoIndex: number): string | false;
    export function getEcoIndexGradesList(): { value: number; grade: string }[];
    export function getQuantiles(): { dom: number[]; req: number[]; size: number[] };
    export function computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex: number): string;
    export function computeWaterConsumptionfromEcoIndex(ecoIndex: number): string;
}
