export const errorHandler = (err, req, res, next) => {
    switch (err.name) {
        case 'JsonWebTokenError':
            res.status(401).json({ message: 'Invalid token' });
            break;
        case 'TokenExpiredError':
            res.status(401).json({ message: 'Token expired' });
            break;
        case 'SyntaxError':
            res.status(400).json({ message: 'Invalid JSON' });
            break;
         
        case 'CastError':
            res.status(400).json({ message: 'Invalid ID' });
            break;
        case 'ValidationError':
            res.status(400).json({ message: err.message });
            break;
        default:
            res.status(500).json({ message: 'Something went wrong' });
            break;
    }
}