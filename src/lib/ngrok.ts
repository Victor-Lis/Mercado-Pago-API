import { env } from "@/config/env";
import ngrok from "@ngrok/ngrok";

async function initNgrok() {
  const ngrokInstance = await ngrok.connect({
    addr: env.PORT,
    authtoken_from_env: true,
    domain: env.NGROK_STATIC_DOMAIN,
  });
  return ngrokInstance;
}

export const ngrokInstance = initNgrok();
