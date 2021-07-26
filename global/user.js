const serverlink = `https://gas-leak-detector.herokuapp.com`;
const serversocket = `ws://gas-leak-detector.herokuapp.com`;


export const USER = {
    host: 'io.adafruit.com',
    port: 80,
    // userName: 'navcul3108',
    // password: 'aio_efhI17dXi8i3ZtaHW94rXiLzFTjq',
    userName: 'CSE_BBC',
    password: '??????',
    suffix: `bk`
}


export const LISTENING_SERVER = {
    sockethost: serversocket,
    registrationAPI: `${serverlink}/api/users/signup`,

    loginAPI: `${serverlink}/api/users/login`,

    logoutAPI: `${serverlink}/api/users/logout`,

    turnOnAlarm: `${serverlink}/api/alarm/turn-on`,

    turnOffAlarm: `${serverlink}/api/alarm/turn-off`,

    historyAPI: `${serverlink}/api/alarm/history`,

    dailyData: `${serverlink}/api/temperature/daily-data`,

    stateGet: `${serverlink}/api/alarm/state`,
}


export const ConnectSetting = {
    QOS: 0,
    RETAIN: true,
};


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
    console.log("GETTING ADAFRUIT FETCH!");

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
        .catch(function (err) {
            console.log(`Error fetching ${topicThingName}!`);
            console.log(err);
        })
    }
    else {
        return Promise.reject(new Error(`No ${topicThingName} record available!`));
    }
}  