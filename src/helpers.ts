export const formatDate = (date: string) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, dateOptions);
}

export const formatDateNav = (date: string) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, dateOptions);
}