export function validateEmail(email) {
    const regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regx.test(String(email).toLowerCase())
}

export function validatePhoneNumber(number) {
    const regx = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return regx.test(String(number).toLowerCase())
}

export function checkIsNumber(number) {
    const regx = /^\d+$/;
    return regx.test(String(number).toLowerCase())
}

export const isFullName = (name) => {
    return name.trim().indexOf(' ') != -1;
}