import Swal from 'sweetalert2'

export async function confirmUnsavedChanges() {
    const result = await Swal.fire({
        title: 'Perubahan belum disimpan',
        text: 'Ada data yang sudah diisi. Jika kembali, data ini akan hilang.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, lanjut',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        theme: 'dark'
    })

    return result.isConfirmed
}
