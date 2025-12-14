export function useServerPagination(store) {
    const onPageChange = async (event) => {

        const page = event.page + 1
        store.page = page
        await store.fetchAll()
    }

    return { onPageChange }
}
