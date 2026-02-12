export function healthPayload() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
