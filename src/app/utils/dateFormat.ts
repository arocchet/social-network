export const formatDate = (date: string) => {
    return date ? new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : ""
}
