import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.prettyPrint(),
        format.printf((info) => {
            const { timestamp, level, message, ...args } = info;
            const ts = timestamp.slice(0, 19).replace('T', ' ');

            return `${ ts } [${ level }]: ${ message } ${ Object.keys(args).length ? JSON.stringify(args, null, 2) : '' }`;
        }),
    ),
    transports: [new transports.Console()]
});
