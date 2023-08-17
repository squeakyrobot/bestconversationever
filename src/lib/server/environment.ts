
const ENVIRONMENT = process.env.VERCEL_ENV || process.env.NODE_ENV || 'production';

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
