// eslint-disable-next-line import/no-anonymous-default-export
export default function (req, res) {
 

  let nodemailer = require('nodemailer')
  const transporter = nodemailer.createTransport({
    service:'Zoho',
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    
  });




  
    
  const mailOptions = {
    from:   req.body.email,
    to: process.env.ZOHO_EMAIL,
    subject: `Message From ${req.body.name}`,
    text: req.body.message + " | Sent from: " + req.body.email,
    html: `<div>${req.body.message}</div><p>Sent from: ${req.body.email}</p>`
  }
  
  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
  })
  
  console.log(req.body)
  res.send('success')
}