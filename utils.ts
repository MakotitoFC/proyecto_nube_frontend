export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getDaysArray = (year: number, month: number) => {
    const monthIndex = month;
    const date = new Date(year, monthIndex, 1);
    const result = [];
    while (date.getMonth() === monthIndex) {
        result.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return result;
};

export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const isDateOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
    const s1 = new Date(start1).getTime();
    const e1 = new Date(end1).getTime();
    const s2 = new Date(start2).getTime();
    const e2 = new Date(end2).getTime();
    return s1 < e2 && s2 < e1;
};

export const getStayDuration = (start: string, end: string): number => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
}