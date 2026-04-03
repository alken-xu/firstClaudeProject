const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendReservationNotification(reservation, room, plan) {
  const nights = reservation.nights;
  const planName = plan ? plan.name : 'プランなし';

  const html = `
    <div style="font-family: 'Noto Sans JP', sans-serif; max-width: 600px; margin: 0 auto; color: #2D2012;">
      <div style="background: #2C4A3E; padding: 24px; text-align: center;">
        <p style="color: #C9A84C; font-size: 12px; letter-spacing: 4px; margin: 0 0 4px;">RESERVATION CONFIRMED</p>
        <h1 style="color: #fff; font-size: 22px; margin: 0;">山の湯 花結</h1>
      </div>

      <div style="padding: 32px; background: #FAF8F5;">
        <h2 style="color: #2C4A3E; font-size: 18px; margin-bottom: 4px;">新規予約が入りました</h2>
        <p style="color: #888; font-size: 13px; margin-top: 0;">予約番号：<strong>${reservation.reservation_no}</strong></p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
          ${row('客室', room ? room.name : reservation.room_id)}
          ${row('プラン', planName)}
          ${row('チェックイン', reservation.check_in)}
          ${row('チェックアウト', reservation.check_out)}
          ${row('泊数', `${nights}泊`)}
          ${row('人数', `${reservation.guest_count}名`)}
          ${row('合計金額', `¥${reservation.total_price.toLocaleString()}`)}
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #fff; border-left: 3px solid #2C4A3E;">
          <h3 style="color: #2C4A3E; font-size: 14px; margin: 0 0 12px;">お客様情報</h3>
          <table style="width: 100%; font-size: 14px;">
            ${row('お名前', reservation.guest_name)}
            ${row('メール', `<a href="mailto:${reservation.guest_email}">${reservation.guest_email}</a>`)}
            ${row('電話', reservation.guest_phone)}
            ${reservation.requests ? row('リクエスト', reservation.requests) : ''}
          </table>
        </div>

        <p style="font-size: 11px; color: #aaa; margin-top: 32px; text-align: center;">
          ※ このメールはデモサイト「山の湯 花結」の予約システムから自動送信されました。
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"山の湯 花結 予約システム" <${process.env.SMTP_USER}>`,
    replyTo: reservation.guest_email,
    to: process.env.NOTIFY_TO,
    subject: `【新規予約】${reservation.reservation_no} ／ ${reservation.guest_name} 様`,
    html,
  });
}

function row(label, value) {
  return `
    <tr>
      <td style="padding: 6px 12px 6px 0; color: #888; white-space: nowrap; vertical-align: top;">${label}</td>
      <td style="padding: 6px 0; font-weight: 500;">${value}</td>
    </tr>`;
}

async function sendContactNotification({ name, email, phone, subject, message }) {
  const html = `
    <div style="font-family: 'Noto Sans JP', sans-serif; max-width: 600px; margin: 0 auto; color: #2D2012;">
      <div style="background: #2C4A3E; padding: 24px; text-align: center;">
        <p style="color: #C9A84C; font-size: 12px; letter-spacing: 4px; margin: 0 0 4px;">NEW INQUIRY</p>
        <h1 style="color: #fff; font-size: 22px; margin: 0;">山の湯 花結</h1>
      </div>

      <div style="padding: 32px; background: #FAF8F5;">
        <h2 style="color: #2C4A3E; font-size: 18px; margin-bottom: 16px;">新しいお問い合わせが届きました</h2>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          ${row('お名前', name)}
          ${row('メール', `<a href="mailto:${email}">${email}</a>`)}
          ${phone ? row('電話番号', phone) : ''}
          ${subject ? row('件名', subject) : ''}
        </table>

        <div style="background: #fff; border-left: 3px solid #2C4A3E; padding: 16px; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">
          ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>

        <p style="font-size: 11px; color: #aaa; margin-top: 32px; text-align: center;">
          ※ このメールはデモサイト「山の湯 花結」のお問い合わせフォームから自動送信されました。
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"山の湯 花結 お問い合わせ" <${process.env.SMTP_USER}>`,
    replyTo: email,
    to: process.env.NOTIFY_TO,
    subject: `【お問い合わせ】${subject || 'お問い合わせ'} ／ ${name} 様`,
    html,
  });
}

module.exports = { sendReservationNotification, sendContactNotification };
