import nodemailer from 'nodemailer';

const emailRegister = async(data) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, name, token } = data;

      //send email
      await transport.sendMail({
        from: 'RealEstate.com',
        to: email,
        subject: 'Confirm your account in RealEstate.com',
        text: 'Confirm your account in RealEstate.com',
        html:`
            <p>Hello ${name}, confirm your account in RealEstate.com</p>
            <p>Your account is ready, you only have to confirm it in the following link: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">CONFIRM ACCOUNT</a></p>
            <p>If you didn't create this account, you can ignore this e-mail.</p>
        `
      })

} 

const emailForgottenPassword = async(data) => {

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const { email, name, token } = data;

    //send email
    await transport.sendMail({
      from: 'RealEstate.com',
      to: email,
      subject: 'Reset your password in RealEstate.com',
      text: 'Reset your password in RealEstate.com',
      html:`
          <p>Hello ${name}, you have requested a password reset in RealEstate.com</p>
          <p>Follow this link to generate a new password: 
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgotten-password/${token}">RESET PASSWORD</a></p>
          <p>If you didn't request a password change, you can ignore this e-mail.</p>
      `
    })

}



export {
    emailRegister,
    emailForgottenPassword
}