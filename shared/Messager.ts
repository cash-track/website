import { FetchError } from 'ofetch'
import type { Ref } from 'vue'
import type { ErrorResponseInterface, ValidationResponseInterface } from '@/api/response'
import { ref, useI18n } from '#imports'

export function useMessager(): Messager {
    return new Messager()
}

export class Messager {
    private isUnprocessableEntityMessageDisabled = false
    public message: Ref<string>
    public showMessage: Ref<boolean>
    private t

    constructor() {
        const { t } = useI18n()
        this.t = t
        this.message = ref<string>('')
        this.showMessage = ref<boolean>(false)
    }

    public getMessage(): string {
        return this.message.value
    }

    public shouldDisplayMessage(): boolean {
        return this.showMessage.value
    }

    public setMessage(msg: string) {
        this.message.value = msg
        this.showMessage.value = true
    }

    public resetMessage() {
        this.message.value = ''
        this.showMessage.value = false
    }

    get hasMessage(): boolean {
        return this.message.value !== ''
    }

    public dispatchError(error: any) {
        if (!(error instanceof FetchError)) {
            return error
        }

        switch (error.statusCode) {
        case 400:
            this.onBadRequestResponse(error.data)
            break
        case 401:
            this.onUnauthorisedResponse(error.data)
            break
        case 403:
            this.onForbiddenResponse(error.data)
            break
        case 417:
            this.onCsrfErrorResponse()
            break
        case 422:
            this.onUnprocessableEntityResponse(error.data)
            break
        case 500:
            this.onInternalServerError(error.data)
            break
        }
    }

    protected onBadRequestResponse(response: ErrorResponseInterface) {
        this.setMessage(response.message)
    }

    protected onUnauthorisedResponse(response: ErrorResponseInterface) {
        this.setMessage(response.message)
    }

    protected onForbiddenResponse(response: ErrorResponseInterface) {
        this.setMessage(response.message)
    }

    protected onCsrfErrorResponse() {
        window.location.reload()
    }

    protected onUnprocessableEntityResponse(
        _response: ValidationResponseInterface
    ) {
        if (this.isUnprocessableEntityMessageDisabled) {
            return
        }

        this.setMessage(this.t('error.validation'))
    }

    protected onInternalServerError(response: ErrorResponseInterface) {
        this.setMessage(response.message)
    }

    public disableUnprocessableEntityMessage() {
        this.isUnprocessableEntityMessageDisabled = true
    }
}
