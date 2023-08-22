
const ENVIRONMENT = process.env.VERCEL_ENV || process.env.NODE_ENV || 'production';

/**
 * Gets a previx for an environment which is used to namespace the data
 * 
 * @param environment
 * @returns 
 */
export function getEnvironmentPrefix(environment: string = ENVIRONMENT): string {
    switch (environment.toLowerCase()) {
        case 'production':
        case 'prod':
            return 'prod';
        case 'development':
        case 'dev':
            return 'dev';
        case 'preview':
        case 'prev':
            return 'prev';
        default:
            return 'u';
    }
}
