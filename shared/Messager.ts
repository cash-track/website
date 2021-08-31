import { Vue, Component } from 'vue-property-decorator'
import {
    ErrorResponseInterface,
    ValidationResponseInterface,
} from '~/api/response'

@Component
export default class Messager extends Vue {
    public message = ''
    public showMessage = false

    public getMessage(): string {
        return this.message
    }

    public shouldDisplayMessage(): boolean {
        return this.showMessage
    }

    public setMessage(msg: string) {
        this.message = msg
        this.showMessage = true
    }

    public resetMessage() {
        this.message = ''
        this.showMessage = false
    }

    get hasMessage(): boolean {
        return this.message !== ''
    }

    protected dispatchError(error: any) {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    this.onBadRequestResponse(error.response.data)
                    break
                case 401:
                    this.onUnauthorisedResponse(error.response.data)
                    break
                case 403:
                    this.onForbiddenResponse(error.response.data)
                    break
                case 422:
                    this.onUnprocessableEntityResponse(error.response.data)
                    break
                case 500:
                    this.onInternalServerError(error.response.data)
                    break
            }
        }

        return error
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

    protected onUnprocessableEntityResponse(
        _response: ValidationResponseInterface
    ) {
        this.setMessage('One or more fields is not valid')
    }

    protected onInternalServerError(response: ErrorResponseInterface) {
        this.setMessage(response.message)
    }
}
