"use server"
import twilio from 'twilio';

export async function sendSMS(to: string, message: string) {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;

        if (!accountSid || !authToken || !fromNumber) {
            throw new Error('Missing required Twilio credentials');
        }

        const client = twilio(accountSid, authToken);

        const response = await client.messages.create({
            body: message,
            from: fromNumber,
            to: to
        });

        return {
            success: true,
            messageId: response.sid
        };

    } catch (error) {
        console.error('SMS送信エラー:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '不明なエラー'
        };
    }
}
