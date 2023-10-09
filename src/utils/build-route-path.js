export const buildRoutePath = (path) => {
    const routeParametersRegex = /:([a-zA-Z]+)/g
    const paramsWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-1\-_]+)')

    const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)
    return pathRegex
}

export default buildRoutePath