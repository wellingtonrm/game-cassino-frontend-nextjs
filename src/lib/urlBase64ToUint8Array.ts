export default function urlBase64ToUint8Array(base64String: string) {
  try {
    // Remove espaços em branco e quebras de linha
    const cleanedBase64 = base64String.trim().replace(/[\n\r\s]/g, '');
    
    // Adiciona padding se necessário
    const padding = '='.repeat((4 - (cleanedBase64.length % 4)) % 4);
    const base64 = (cleanedBase64 + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    console.log('Chave VAPID convertida com sucesso. Tamanho:', outputArray.length, 'bytes');
    return outputArray;
  } catch (error) {
    console.error('Erro ao converter chave VAPID:', error);
    throw new Error('Falha ao converter chave VAPID. Certifique-se que a chave está no formato correto.');
  }
}