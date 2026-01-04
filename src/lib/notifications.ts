// OneSignal App ID
const ONESIGNAL_APP_ID = '4778b65c-8b4b-433c-b6e1-95c5aa83c23f';

// OneSignal'ı başlat ve izin iste
export const initOneSignal = async () => {
  try {
    const OneSignal = (window as any).OneSignal;
    if (OneSignal) {
      // Kullanıcıdan bildirim izni iste
      await OneSignal.Slidedown.promptPush();
    }
  } catch (error) {
    console.log('OneSignal init error:', error);
  }
};

// Bildirim göster (yerel bildirim - basit yöntem)
export const showLocalNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/panda.jpg',
      badge: '/panda.jpg',
    });
  }
};

// Bildirim izni iste
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// OneSignal üzerinden tüm kullanıcılara bildirim gönder
// NOT: Bu fonksiyon REST API Key gerektirir (güvenlik için backend'de olmalı)
// Şimdilik Supabase Edge Function ile yapacağız
export const sendPushToAll = async (title: string, message: string) => {
  // Bu fonksiyon Supabase Edge Function'dan çağrılacak
  console.log('Push notification gönderilecek:', title, message);
};

