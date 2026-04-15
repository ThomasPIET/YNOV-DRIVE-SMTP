import { env } from '../config/env.js';

export const checkServiceToken = (req, res, next) => {
    const serviceToken = req.headers['x-service-token'];

    if (!serviceToken || serviceToken !== env.smtpServiceToken) {
        return res.status(403).json({
            message: 'Accès interdit : token de service invalide.',
        });
    }

    next();
};