import { EmailQueueRepository } from "../repositories/emailQueue.repository.js";
import { renderTemplate } from "../utils/templateEngine.js";
import { resend } from "../config/mail.js";
import { env } from "../config/env.js";
import { sequelize } from "../config/database.js";

export const EmailQueueService = {
    queueEmail: async (emailData) => {
        // console.log("Queueing email:", emailData);
        const transaction = await sequelize.transaction();
        try {
            if (!emailData) {
                throw new Error("Email data is required", 400);
            }

            if (!emailData.to_email) {
                throw new Error("Recipient email is required", 400);
            }
            
            // Logique pour ajouter un email à la file d'attente
            const email = await EmailQueueRepository.create(emailData, { transaction });
            await transaction.commit();
            return email;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
    sendEmail: async (emailData, variables = {}) => {
        // console.log("Sending email:", emailData);
        const html = renderTemplate(emailData.body_template, variables);
        
        const result = await resend.emails.send({
            from: env.mail.from,
            to: "rejen.aligora@ynov.com", // Sur Resend, la version gratuite n'autorise que l'envoie de mail test depuis son propre compte. A remplacer par emailData.to_email,
            subject: emailData.subject,
            html: html,
        });

        if (result.error) {
            await EmailQueueRepository.update(emailData.id, { status: 'failed', retries: emailData.retries + 1 });
            throw new Error(`Failed to send email: ${result.error.message}`);
        };

        await EmailQueueRepository.update(emailData.id, { status: 'sent' });

        return {
            result,
            message: `Email sent successfully to ${emailData.to_email} with subject "${emailData.subject}".`,
        };
    },
};