export function generateInspectionId(existingCount: number): string {
        const prefix = 'MI';
        const runningNumber = (existingCount + 1).toString().padStart(4, '0');
        return `${prefix}-${runningNumber}`;
    }