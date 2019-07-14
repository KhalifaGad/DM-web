import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({
        userId
    }, '<thi$I$MyToken$ecret/>', {
        expiresIn: '7 days'
    })
}

export {
    generateToken as
    default
}