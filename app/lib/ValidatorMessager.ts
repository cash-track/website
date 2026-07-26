import type { Ref } from 'vue'
import type { ValidationResponseInterface } from '@/api/response'
import { ref } from '#imports'
import { Messager } from '@/lib/Messager'

export function useValidationMessager(): ValidatorMessager {
    return new ValidatorMessager()
}

class ValidatorMessager extends Messager {
    public validationMessages: Ref<Record<string, string>>

    constructor() {
        super()

        this.validationMessages = ref<Record<string, string>>({})
    }

    public override resetMessage() {
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

    protected override onUnprocessableEntityResponse(response: ValidationResponseInterface) {
        super.onUnprocessableEntityResponse(response)
        this.setValidationMessages(response.errors)
    }

    /**
     * Used on ui validation state
     */
    public validationState(field: string): boolean | null {
        return this.hasValidationMessage(field) ? false : null
    }

    /**
     * Must return `undefined`, not `''`, for a clean field: `UFormField`'s `error` prop is
     * `[Boolean, String]`, and Vue casts an empty-string binding to `true`.
     */
    public validationMessage(field: string): string | undefined {
        if (this.hasValidationMessage(field)) {
            return this.validationMessages.value[field]
        }

        return undefined
    }
}
