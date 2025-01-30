declare namespace NodeJS {
    export interface ProcessEnv {
        MYSQL_HOST: string;
        MYSQL_USERNAME: string;
        MYSQL_PASSWORD: string;
        MYSQL_DATABASE: string;
        PORT: number;
    }
}