const backendUrl = process.env.BACKEND_URL || '';
const rawWsUrl = process.env.WEB_SOCKET_URL || '';
const connectPath = process.env.BACKEND_CONNECT_PATH || '/connect';

function stripTrailingSlash(s: string) {
  return s.replace(/\/+$/, '');
}

export const config = {
  connectPath,
  endpointUrl: rawWsUrl
    ? `${stripTrailingSlash(rawWsUrl)}${connectPath}`
    : connectPath,
  forceWsHost: rawWsUrl ? new URL(rawWsUrl).host : null,
  forceWsScheme: rawWsUrl.startsWith('https://') ? 'wss' : rawWsUrl.startsWith('http://') ? 'ws' : null,
} as const;
