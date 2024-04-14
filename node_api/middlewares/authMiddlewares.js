import jwt from 'jsonwebtoken';


export const userAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    console.log(process.env.APP_SECRET);
    if (!authorization) {
        return res.status(401).json({
            status: 'fail',
            redirect:"/login",
            message: 'You are not logged in! Please log in to get access.',
        });
    }
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: 'fail',
                redirect:"/login",
                message: 'Invalid token! Please log in again.',
            });
        };
        if (!decoded) {
            return res.status(403).json({
                status: 'fail',
                redirect:"/login",
                message: 'Invalid token! Please log in again.',
            });
        };
    console.log(decoded);
    req.user = decoded;
    next();
    
    });
}

export const checkRole = (role) => async(req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({
            status: 'fail',
            message: `You are not authorized to perform this action`,
        });
    }
    next();

}