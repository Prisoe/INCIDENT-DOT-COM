// BACK-END/middleware/authenticateToken.js:

const jwt = require('jsonwebtoken');

const secret = 'Incident-Application-Centennial'; // Secret hardcoded

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        
        // Get token from array
        const bearerToken = bearer[1];

        console.log('Bearer token:', bearerToken); // Log the token

        // Check if token has expired
        const decodedToken = jwt.decode(bearerToken);
        const dateNow = new Date();

        if(decodedToken.exp < dateNow.getTime()/1000){
            console.log("Token has expired.");
            res.sendStatus(401); // Unauthorized due to expired token
        } else {
            console.log("Token has not expired.");

            // verify the token
            jwt.verify(bearerToken, secret, (err, authData) => { // using the secret
                if(err) {
                    console.error('JWT verification error:', err); // Log the error
                    res.sendStatus(403); // Forbidden
                } else {
                    console.log('Auth data:', authData); // Log the decoded payload
                    // Next middleware
                    req.user = authData; 
                    next();
                }
            });
        }
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

module.exports = verifyToken;
