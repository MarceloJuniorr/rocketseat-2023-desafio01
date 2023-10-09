export const extractQueryParams = ((query) => {
    return query.substr(1).split('&').reduce((queryParams, param) => {
      let [key, value] = param.split('=')
         value = value.replace(/\+/g, ' ')
      queryParams[key] = value
      return queryParams
    }, {})
  })  