import Cookies from 'js-cookie'
import type { StorageInterface, StorageItemInterface } from '@/services/LocalStorage'

export class CookieStorage implements StorageInterface {
    protected options: Cookies.CookieAttributes = {
        expires: 7,
        path: '',
        secure: true,
        sameSite: 'strict'
    }

    has(key: string): boolean {
        const item = this.get(key)

        if (item === null) {
            return false
        }

        return typeof item.value === 'string' && item.value.length > 0
    }

    add(item: StorageItemInterface) {
        Cookies.set(item.key, item.value, this.options)
    }

    get(key: string): StorageItemInterface | null {
        const cookie = Cookies.get(key)

        if (cookie === undefined) {
            return null
        }

        return {
            key,
            value: cookie
        }
    }

    remove(key: string) {
        Cookies.remove(key, this.options)
    }

    isSupported(): boolean {
        return true
    }

    clear() {}
}
