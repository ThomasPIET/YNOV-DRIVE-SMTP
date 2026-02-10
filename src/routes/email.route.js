import { Router } from "express";
import { EmailController } from "../controllers/email.controller.js";
import { checkServiceToken } from "../middleware/checkServiceToken.middleware.js";

const router = Router();

router.post('/send', checkServiceToken, EmailController.sendEmail);
router.post('/queue', checkServiceToken, EmailController.queueEmail);

export default router;