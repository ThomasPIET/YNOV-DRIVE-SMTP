import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const EmailQueueModel = sequelize.define(
    'email_queue',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        to_email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        body_template: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'sent', 'failed'),
            defaultValue: 'pending',
        },
        retries: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        scheduled_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'email_queue',
        timestamps: false,
    }
);