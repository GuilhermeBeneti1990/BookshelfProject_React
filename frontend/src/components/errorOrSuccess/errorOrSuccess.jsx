import Swal from 'sweetalert2'

export function showAlert(icon, text) {
    return Swal.fire({
            icon: icon,
            text: text,
        })
}

export function showCompleteAlert(icon, text, showCancelButton, confirmButtonText, cancelButtonText) {
    return Swal.fire({
            icon: icon,
            text: text,
            showCancelButton: showCancelButton,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
        })
}