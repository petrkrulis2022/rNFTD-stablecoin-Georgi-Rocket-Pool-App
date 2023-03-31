import { MoralisNextApi } from "@moralisweb3/next";

export default MoralisNextApi({
  apiKey: process.env.MORALIS_API_KEY,
  authentication: {
    domain: process.env.APP_DOMAIN,
    statement: "Please sign this message to confirm your identity.",
    uri: "https://rnftd-stablecoin-app.netlify.app/",
    timeout: 120,
  },
});
