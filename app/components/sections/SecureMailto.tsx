import React, { FC } from "react";

const SecureMailto: FC = () => {
  const user = "get";
  const domain = "romanhermens.com";
  const subject = "Wavehounds - send me some stickers";
  const body = "here is my address:";

  const mailtoLink = `mailto:${user}@${domain}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={mailtoLink}
      className="text-white hover:text-black font-semibold text-lg hover:animate-shiver transition-all duraiton-100"
      aria-label="Request stickers via email"
    >
      Send me some Stickers!!
    </a>
  );
};

export default SecureMailto;
