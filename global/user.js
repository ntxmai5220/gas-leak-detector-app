export const USER = {
    host: 'io.adafruit.com',
    port: 80,
    userName: 'johnwick123',
    password: 'aio_QyaX72AdGUl5iv1ns4PdnufBGN7H',
}

export const DefaultConnectOptions = {
    reconnect: false,
    cleanSession: true,
    mqttVersion: 3,
    keepAliveInterval: 60,
    timeout: 60
}

export const ConnectSetting = {
    QOS: 0,
    RETAIN: true,
};

export const Topics = [
    'johnwick123/feeds/fan',
    'johnwick123/feeds/valve',
];

export const Subscribe_Topics = [
    { name: 'johnwick123/feeds/fan', thing: 'fan' },
    { name: 'johnwick123/feeds/pump', thing: 'pump' },
    { name: 'johnwick123/feeds/valve', thing: 'valve' },
];