import { EmailQueueRepository } from "../repositories/emailQueue.repository.js";
import { EmailQueueService } from "../services/emailQueue.service.js";
import Joi from "joi";

const emailSchema = Joi.object({
    emails: Joi.array().items(Joi.string().email().required()).required(),
    subject: Joi.string().required(),
    body_template: Joi.string().required(),
    data: Joi.object().optional(),
    scheduled_at: Joi.date().optional(),
});

export const EmailController = {
    sendEmail: async (req, res) => {
        try {
            const emails = await EmailQueueRepository.getAllEmailsToSend();
            if (emails.length === 0) {
                return res.status(200).json({ message: 'No emails to send' });
            }

            const messages = [];
            for (const email of emails) {
                // console.log(`Processing email: `, email);
                const response = await EmailQueueService.sendEmail(email.dataValues, { name: email.data.name, email: email.to_email });
                if (response.result.error) {
                    messages.push(`Failed to send email to ${email.to_email}: ${response.result.error.message}`);
                } else {
                    messages.push(`Email sent successfully to ${email.to_email} with subject "${email.subject}".`);
                }
            }
            res.status(200).json({ message: messages });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email' });
        }
    },
    queueEmail: async (req, res) => {
        try {
            const { emails, subject, body_template, data, scheduled_at } = req.body;
            const { error } = emailSchema.validate({ emails, subject, body_template, data, scheduled_at });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            for (const email of emails) {
                if (!email || typeof email !== 'string' || !email.includes('@')) {
                    return res.status(400).json({ message: `Invalid email address: ${email}` });
                }
                await EmailQueueService.queueEmail({ to_email: email, subject, body_template, data, scheduled_at });
            }
            res.status(200).json({ message: 'Email queued successfully' });
        } catch (error) {
            console.error('Error queuing email:', error);
            res.status(500).json({ message: 'Failed to queue email' });
        }
    },
};