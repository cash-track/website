import { IncomingMessage, ServerResponse } from 'http'

export type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void

export class Route {
    method: string
    path: string
    handler: RouteHandler

    constructor(method: string, path: string, handler: RouteHandler) {
        this.method = method
        this.path = path
        this.handler = handler
    }

    public match(req: IncomingMessage): boolean {
        return (
            this.method === req.method &&
            !!req.url?.replace('/api', '').startsWith(this.path)
        )
    }
}

export class Router {
    private routes: Array<Route> = []
    private fallbackRoute!: Route

    push(method: string, path: string, handler: RouteHandler) {
        this.routes.push(new Route(method, path, handler))
    }

    get(path: string, handler: RouteHandler) {
        this.push('GET', path, handler)
    }

    post(path: string, handler: RouteHandler) {
        this.push('POST', path, handler)
    }

    fallback(handler: RouteHandler) {
        this.fallbackRoute = new Route('*', '*', handler)
    }

    dispatch(req: IncomingMessage, res: ServerResponse) {
        this.routes.sort((a: Route, b: Route): number => {
            return b.path.length - a.path.length
        })

        for (const route of this.routes) {
            if (!route.match(req)) {
                continue
            }

            route.handler(req, res)
            return
        }

        this.fallbackRoute.handler(req, res)
    }
}
