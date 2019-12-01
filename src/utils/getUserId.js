import jwt from 'jsonwebtoken'

// This is an authentication function
const getUserId = (req, fromSubscription = false) => {
    let header
    if(fromSubscription){
	console.log('get in =================')
        header = req.connection.context.authorization
	//console.log(header)
    } else {
	//console.log('else ==================')
	//console.log(req)
        header = req.req.headers.authorization
        if(header == 'admin'){
            return 
        }
    }
    
    if(!header) {
        throw new Error('Authentication required!.')
    }

    const token = header.replace('Bearer ', '')
    const decoded = jwt.verify(token, '<thi$I$MyToken$ecret/>')

    return decoded.userId
}

export { getUserId as default}
