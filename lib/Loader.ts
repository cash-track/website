import type { Ref } from 'vue'
import { ref } from '#imports'

export function useLoader(): Loader {
    return new Loader()
}

class Loader {
    public loading: Ref<boolean>

    constructor() {
        this.loading = ref<boolean>(false)
    }

    public setLoading() {
        this.loading.value = true
    }

    public setLoaded() {
        this.loading.value = false
    }

    public isLoading(): boolean {
        return this.loading.value
    }
}
