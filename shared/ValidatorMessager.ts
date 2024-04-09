import type { Ref } from 'vue'
import type { ValidationResponseInterface } from '@/api/response'
import { ref } from '#imports'
import { Messager } from '@/shared/Messager'

export function useValidationMessager(): ValidatorMessager {
    return new ValidatorMessager()
}

class ValidatorMessager extends Messager {
    public validationMessages: Ref<Record<string, string>>

    constructor() {
        super()

        this.validationMessages = ref<Record<string, string>>({})
    }

    public resetMessage() {
        super.resetMessage()
        this.resetValidationMessages()
    }

    public resetValidationMessages() {
        this.validationMessages.value = {}
    }

    public resetValidationMessage(field: string) {
        if (!this.hasValidationMessage(field)) {
            return
        }

        this.validationMessages.value[field] = ''
    }

    public hasValidationMessage(field: string): boolean {
        if (typeof this.validationMessages.value !== 'object') {
            this.resetMessage()
        }

        return (
            Object.keys(this.validationMessages.value).filter(key => key === field)
                .length > 0 && this.validationMessages.value[field] !== ''
        )
    }

    public setValidationMessages(msgs: Record<string, string>) {
        this.validationMessages.value = msgs
    }

    public setValidationMessage(field: string, msg: string) {
        this.hasValidationMessage(field)
        this.validationMessages.value[field] = msg
    }

    protected onUnprocessableEntityResponse(response: ValidationResponseInterface) {
        super.onUnprocessableEntityResponse(response)
        this.setValidationMessages(response.errors)
    }

    /**
     * Used on ui validation state
     */
    public validationState(field: string): boolean | null {
        return this.hasValidationMessage(field) ? false : null
    }

    public validationMessage(field: string): string {
        if (this.hasValidationMessage(field)) {
            return this.validationMessages.value[field]
        }

        return ''
    }
}
