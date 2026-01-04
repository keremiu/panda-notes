// Netlify Function - Push Notification Gönder
exports.handler = async (event) => {
  // Sadece POST isteklerini kabul et
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { title, message } = JSON.parse(event.body);

    if (!title || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Title and message required' }),
      };
    }

    // OneSignal API'ye bildirim gönder
    const response = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Key os_v2_app_i54lmxeljnbtznxbsxc2va6ch62luuzt2guere4qqvitiikecwdfvix7sn5ijvtqw4zsuz5ei6s4rcilnj4avutia4qmkrsq2mr3osa',
      },
      body: JSON.stringify({
        app_id: '4778b65c-8b4b-433c-b6e1-95c5aa83c23f',
        included_segments: ['All'],
        contents: { en: message, tr: message },
        headings: { en: title, tr: title },
        chrome_web_icon: 'https://pandanotesa.netlify.app/panda.jpg',
        firefox_icon: 'https://pandanotesa.netlify.app/panda.jpg',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OneSignal error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to send notification', details: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

