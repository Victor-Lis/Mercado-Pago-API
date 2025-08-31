import { env } from "@/config/env";
import ngrok from "@ngrok/ngrok";

async function initNgrok() {
  const ngrokInstance = await ngrok.connect({
    addr: env.PORT,
    authtoken_from_env: true,
    domain: env.NGROK_STATIC_DOMAIN,
  });
  console.log("Ngrok tunnel established at:", ngrokInstance);
  return ngrokInstance;
}

export const ngrokInstance = initNgrok();