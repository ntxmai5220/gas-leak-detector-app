// export const USER = {
//     host: 'io.adafruit.com',
//     port: 80,
//     userName: 'johnwick123456',
//     password: 'aio_PllJ02ZP2jCbJg85G1kv08XM7niP',
//     suffix: `bk`
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
    suffix: `kkllm`
}

export const ConnectSetting = {
    QOS: 0,
    RETAIN: true,
};

// didnt use this
export const Topics = [{
        //johnwick123456
        name: `${USER.userName}/feeds/kkllm-iot-relay`,
        thing: 'relay',
        jsonobj: (payload) => {
            return {
                id: "1",
                name: "RELAY",
                data: payload,
                unit: ""
            };
                
        },
        on: '1',
        off: '0',
    },{
        name: `${USER.userName}/feeds/kkllm-iot-speaker`,
        thing: 'valve',
        jsonobj: (payload) => {
            return {
                id: "3",
                name: "SPEAKER",
                data: payload,
                unit: "",
            };

        },
        on: '888',
        off: '0',
    },{
        name: `${USER.userName}/feeds/kkllm-iot-lcd`,
        thing: 'valve',
        jsonobj: (payload) => {
            return {
                id: "5",
                name: "LCD",
                data: payload,
                unit: "",
            };

        },
        on: 'System WARNING!',
        off: 'System normal',
    },{
        name: `${USER.userName}/feeds/kkllm-iot-led`,
        thing: 'valve',
        jsonobj: (payload) => {
            return {
                id: "1",
                name: "LED",
                data: payload,
                unit: "",
            };

        },
        on: '1',
        off: '0',
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
        name: `${USER.userName}/feeds/${USER.suffix}-iot-relay`,
        thing: 'relay',
        feed: `${USER.suffix}-iot-relay`
    },{
        name: `${USER.userName}/feeds/${USER.suffix}-iot-temp-humid`,
        thing: 'temp',
        feed: `${USER.suffix}-iot-temp-humid`
    },{
        name: `${USER.userName}/feeds/${USER.suffix}-iot-gas`,
        thing: 'gas',
        feed: `${USER.suffix}-iot-gas`
    },
];

export const getAdafruitFetch = (topicThingName, fetchNumber) => {

    console.log("THIS FUNC HAS BEEN CALLED!");

    var foundTopic = null;

    Subscribe_Topics.forEach(element => {
        if (element.thing == topicThingName) {
            console.log("Found topic!");
            foundTopic = element;

        }
    });

    if (foundTopic) {
        return fetch(`https://io.adafruit.com/api/v2/${USER.userName}/feeds/${foundTopic.feed}/data?limit=${fetchNumber}`, {
            method: 'GET',
            headers: {
                'X-AIO-Key': USER.password
            }
            })
            .then(response => response.json())
            // .then(function(response) {
            //     executeFunction(response)
            // })
            .catch(function (err) {
                console.log(`Error fetching ${topicThingName}!`);
                console.log(err);
            })
    }
    else {
        return Promise.reject(new Error(`No ${topicThingName} record available!`));
    }
}  