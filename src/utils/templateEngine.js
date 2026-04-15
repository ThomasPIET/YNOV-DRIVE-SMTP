import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Renders an email template with the given variables.
 * @param {string} templateName - The name of the template file (e.g., 'welcome.hbs').
 * @param {object} variables - An object containing the variables to replace in the template.
 * @returns {string} The rendered email content.
 * @throws Will throw an error if the template file is not found.
 */
export const renderTemplate = (templateName, variables = {}) => {
    const templatePath = path.join(
        __dirname,
        '..',
        'templates',
        templateName
    );

    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template ${templateName} not found at path ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    return template(variables);
};