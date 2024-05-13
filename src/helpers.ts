export const formatDate = (date: string) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, dateOptions);
}

export const formatDateNav = (date: string) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, dateOptions);
}