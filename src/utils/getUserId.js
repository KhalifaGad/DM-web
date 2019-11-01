import jwt from 'jsonwebtoken'

// This is an authentication function
const getUserId = (req, fromSubscription = false) => {
    let header
    if(fromSubscription){
        header = req.connection.context.authorization
    } else {
        header = req.req.headers.authorization
    }
    
    if(!header) {
        throw new Error('Authentication required!.')
    }

    const token = header.replace('Bearer ', '')
    const decoded = jwt.verify(token, '<thi$I$MyToken$ecret/>')

    return decoded.userId
}

export { getUserId as default}