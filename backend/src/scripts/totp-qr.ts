import qrcode from "qrcode";

const otpAuthUrl = process.argv[2];

if (!otpAuthUrl) {
  throw new Error("OTP Auth URL is required");
}

const main = async () => {
  await qrcode.toFile("totp.png", otpAuthUrl);
  console.log("QR code saved!");
};

main().catch((error) => {
  console.error("Error generating QR code:", error);
  process.exit(1);
});
