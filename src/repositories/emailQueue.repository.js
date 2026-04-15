import { EmailQueueModel } from "../models/emailQueue.model.js";
import { Op } from "sequelize";

export const EmailQueueRepository = {
    getAllEmailsToSend: async (options = {}) => {
        return await EmailQueueModel.findAll({
            where: { 
                status: { [Op.in]: ['pending', 'failed'] },
                scheduled_at: { [Op.lte]: new Date() } 
            }, ...options 
        });
    },
    // findAll: async (options = {}) => {
    //     return await EmailQueueModel.findAll(options);
    // },
    // findById: async (id, options = {}) => {
    //     return await EmailQueueModel.findByPk(id, options);
    // },
    create: async (data, options = {}) => {
        return await EmailQueueModel.create(data, options);
    },
    update: async (id, data, options = {}) => {
        return await EmailQueueModel.update(data, { where: { id }, ...options });
    },
    // delete: async (id, options = {}) => {
    //     return await EmailQueueModel.destroy({ where: { id }, ...options });
    // },
};