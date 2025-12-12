const getGradeFromScore = (score?: number | null) => {
    const s = score ?? 0;
    if (s >= 90) return 'A';
    if (s >= 70) return 'B';
    if (s >= 50) return 'C';
    return 'D';
};

export { getGradeFromScore };
