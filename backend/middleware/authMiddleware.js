const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    console.log('Authorization Header:', authHeader);
  
    if (!authHeader) {
      console.log('No Authorization header provided.');
      return res.status(403).json({ message: 'No token provided.' });
    }
  
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('Invalid token format.');
      return res.status(401).json({ message: 'Token format is invalid.' });
    }
  
    const token = parts[1];
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err);
        return res.status(500).json({ message: 'Failed to authenticate token.' });
      }
  
      req.userId = decoded.userId;
      console.log('Authenticated userId:', req.userId);
      next();
    });
  };