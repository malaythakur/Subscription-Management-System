const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ... err };
        error.message = err.message; //copy of the original error
        console.error(err);

        // Mongoose bad objectId -> When this happens ? -> GET /api/users/abc123 -> But MongoDB expects: 64b9a4f0c12e9c2a... ->  User gives invalid ID format
        if (err.name === 'CastError'){
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;      
        } 

        // Mongoose Duplicate key -> Email is marked unique: true -> User tries to register with same email again
        if (err.code === 11000){
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose Validation Error -> When this happens ? -> Required field missing -> Email format wrong -> Password too short
        if (err.code === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }
        // Client never sees stack trace -> 👉 Only clean message
        res.status(error.statusCode || 500).json({
            success: false, 
            error: error.message || 'Server Error'
        });
    }catch (error) {
        next(error);
    }

};

export default errorMiddleware;