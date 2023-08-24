export function getProjectId() {
    let data = window.location.pathname.split('/');
    return data[data.length - 1]
}