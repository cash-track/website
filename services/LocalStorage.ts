export interface StorageItemInterface {
    key: string
    value: any
}

export interface StorageInterface {
    isSupported(): boolean
    has(key: string): boolean
    add(item: StorageItemInterface): void
    get(key: string): StorageItemInterface | null
    remove(key: string): void
    clear(): void
}

export class LocalStorageWorker implements StorageInterface {
    public localStorageSupported: boolean

    constructor() {
        this.localStorageSupported =
            typeof window !== 'undefined' &&
            typeof window.localStorage !== 'undefined' &&
            window.localStorage != null
    }

    isSupported(): boolean {
        return this.localStorageSupported
    }

    has(key: string): boolean {
        const item = this.get(key)

        if (item === null) {
            return false
        }

        return typeof item.value === 'string' && item.value.length > 0
    }

    add(item: StorageItemInterface) {
        if (!this.localStorageSupported) {
            return
        }

        localStorage.setItem(item.key, item.value)
    }

    get(key: string): StorageItemInterface | null {
        if (!this.localStorageSupported) {
            return null
        }

        return {
            key,
            value: localStorage.getItem(key)
        }
    }

    remove(key: string) {
        if (!this.localStorageSupported) {
            return
        }

        localStorage.removeItem(key)
    }

    clear() {
        if (!this.localStorageSupported) {
            return
        }

        localStorage.clear()
    }
}
