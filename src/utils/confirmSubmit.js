import Swal from 'sweetalert2'

export async function confirmFinalSubmit() {
    const result = await Swal.fire({
        title: 'Submit Onboarding?',
        text: 'Setelah disubmit, data tidak dapat diubah kembali.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        theme: 'dark'
    })

    return result.isConfirmed
}
