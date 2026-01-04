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

// Tüm kullanıcılara push notification gönder
export const sendPushNotification = async (title: string, message: string) => {
  try {
    const response = await fetch('/.netlify/functions/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, message }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Notification error:', data);
      return false;
    }

    console.log('Notification sent:', data);
    return true;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
};

