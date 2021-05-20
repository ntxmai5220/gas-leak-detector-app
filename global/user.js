// export const USER = {
//     host: 'io.adafruit.com',
//     port: 80,
//     userName: 'johnwick123',
//     password: 'aio_QyaX72AdGUl5iv1ns4PdnufBGN7H',
// }
// export const USER = {
//     host: 'io.adafruit.com',
//     port: 80,
//     userName: 'linhcute',
//     password: 'aio_pvvd92VV1B5ymvtnJEvQeVh7f8KL',
// }

export const USER = {
    host: 'io.adafruit.com',
    port: 80,
    userName: 'navcul3108',
    password: 'aio_efhI17dXi8i3ZtaHW94rXiLzFTjq',
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
        name: 'navcul3108/feeds/kkllm-iot-relay',
        thing: 'kkllm-iot-relay',
        jsonobj: (payload) => {
            return {
                id: "1",
                name: "RELAY",
                data: payload,
                unit: ""
            };
                
        },
        on: '1',
        off: '0'
    },
    // {
    //     name: 'johnwick123/feeds/fan',
    //     thing: 'fan',
    //     jsonobj: (payload) => {
    //         return {
    //             id: "11",
    //             name: "RELAY",
    //             data: payload,
    //             unit: ""
    //         };
                
    //     },
    //     on: '1',
    //     off: '0',
    // },{
    //     name: 'johnwick123/feeds/valve',
    //     thing: 'valve',
    //     jsonobj: (payload) => {
    //         return {
    //             id:"11",
    //             name:"RELAY",
    //             data: payload,
    //             unit: ""
    //         };

    //     },
    //     on: '1',
    //     off: '0',
    // },
];

export const Subscribe_Topics = [{
        name: 'navcul3108/feeds/kkllm-iot-led',
        thing: 'kkllm-iot-led',
    },{
        name: 'navcul3108/feeds/kkllm-iot-temp-humid',
        thing: 'kkllm-iot-temp-humid',
    },
    {
        name:'navcul3108/feeds/kkllm-iot-gas',
        thing:'kkllm-iot-gas'
    },
    {
        name: 'navcul3108/feeds/kkllm-iot-relay',
        thing:'kkllm-iot-relay'
    }
    // {
    //     name: 'johnwick123/feeds/fan',
    //     thing: 'fan',
    // },{
    //     name: 'johnwick123/feeds/pump',
    //     thing: 'pump',
    // },{
    //     name: 'johnwick123/feeds/valve',
    //     thing: 'valve',
    // },
];