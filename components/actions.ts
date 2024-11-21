"use server";

const cfSecrets = {
  env: process.env.CF_SECRET_KEY!,
  alwaysPass: "1x0000000000000000000000000000000AA",
  alwaysFail: "2x0000000000000000000000000000000AA",
  tokenAlreadySpentError: "3x0000000000000000000000000000000AA",
};

let count = 0;

export async function getCount$() {
  return {
    count,
  };
}

export async function increment$(body: { turnstile: string | undefined }) {
  const turnstilePasses = await validateTurnstileToken(
    cfSecrets.env,
    // cfSecrets.alwaysPass,
    // cfSecrets.alwaysFail,
    // cfSecrets.tokenAlreadySpentError,
    body.turnstile
  );

  return {
    count: turnstilePasses ? ++count : count,
    turnstilePasses,
  };

  async function validateTurnstileToken(
    secret: string,
    token: string | undefined
  ) {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: `secret=${encodeURIComponent(
          secret
        )}&response=${encodeURIComponent(token || "")}`,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    const body = await response.json();
    console.log("validateTurnstileToken", body);

    return !!body.success;
  }
}
