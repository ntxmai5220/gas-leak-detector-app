export const USER = {
    host: 'io.adafruit.com',
    port: 80,
    userName: 'johnwick123',
    password: 'aio_IsrW44huvNdshHaTexHxHia49ZYg',
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

export const Topics = [{
        name: 'johnwick123/feeds/fan',
        thing: 'fan',
        jsonobj: (payload) => {
            return {
                id: "11",
                name: "RELAY",
                data: payload,
                unit: ""
            };
                
        },
        on: '1',
        off: '0',
    },{
        name: 'johnwick123/feeds/valve',
        thing: 'valve',
        jsonobj: (payload) => {
            return {
                id:"11",
                name:"RELAY",
                data: payload,
                unit: ""
            };

        },
        on: '1',
        off: '0',
    },
];

export const Subscribe_Topics = [{
        name: 'johnwick123/feeds/fan',
        thing: 'fan',
    },{
        name: 'johnwick123/feeds/pump',
        thing: 'pump',
    },{
        name: 'johnwick123/feeds/valve',
        thing: 'valve',
    },
];