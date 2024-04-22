const nodemailer = require("nodemailer");
const Mustache = require("mustache");
const { gmail, password } = require("../../config");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: gmail,
    pass: password,
  },
});

const verifMail = async (getEmail, data) => {
  try {
    let template = fs.readFileSync("app/views/email/verifikasi.html", "utf8");

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Verifikasi Work Order",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const DiketahuiWO = async (getEmail, data) => {
  try {
    let template = fs.readFileSync(
      "app/views/email/VerifikasiHeadIT.html",
      "utf8"
    );

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Confirmation Pengerjaan Work Order",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const ApproveRejected = async (getEmail, data) => {
  try {
    let template = fs.readFileSync(
      "app/views/email/approveRejected.html",
      "utf8"
    );

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Work Order Approval Rejected",
      html: Mustache.render(template, {
        NamaBarang: data.NamaBarang,
        KodeBarang: data.KodeBarang,
      }),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const ApproveAccepted = async (getEmail, data) => {
  try {
    let template = fs.readFileSync(
      "app/views/email/approveAccepted.html",
      "utf8"
    );

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Work Order Approval Accepted",
      html: Mustache.render(template, {
        NamaBarang: data.NamaBarang,
        KodeBarang: data.KodeBarang,
      }),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const StatusOnProgress = async (getEmail, data) => {
  try {
    let template = fs.readFileSync("app/views/email/onProgressWO.html", "utf8");

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Work Order On Progress",
      html: Mustache.render(template, {
        NamaBarang: data.NamaBarang,
        KodeBarang: data.KodeBarang,
      }),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const StatusClose = async (getEmail, data) => {
  try {
    let template = fs.readFileSync("app/views/email/closeWO.html", "utf8");

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Work Order Close",
      html: Mustache.render(template, {
        NamaBarang: data.NamaBarang,
        KodeBarang: data.KodeBarang,
      }),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const RequestChangeSparepart = async (getEmail, data) => {
  try {
    let template = fs.readFileSync(
      "app/views/email/changeSparepart.html",
      "utf8"
    );

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Informasi Pergantian Sparepart",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const ApproveChangeSparepart = async (getEmail, data) => {
  try {
    let template = fs.readFileSync(
      "app/views/email/approveChangeSparepart.html",
      "utf8"
    );

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Pergantian Sparepart Disetujui",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const RejectedChangeSparepart = async (getEmail, data) => {
  try {
    let template = fs.readFileSync(
      "app/views/email/rejectedChangeSparepart.html",
      "utf8"
    );

    let message = {
      from: "'WorkOrder HTA' <no-reply@gmail.com>",
      to: getEmail,
      subject: "Pergantian Sparepart Ditolak",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  verifMail,
  DiketahuiWO,
  RequestChangeSparepart,
  ApproveRejected,
  ApproveAccepted,
  StatusOnProgress,
  StatusClose,
  ApproveChangeSparepart,
  RejectedChangeSparepart,
};
