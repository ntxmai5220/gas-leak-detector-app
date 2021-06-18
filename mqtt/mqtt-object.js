import {AsyncStorage} from "../node_modules/react-native";
import init from 'react_native_mqtt';
import uuid from 'react-native-uuid';
import { useState } from 'react';

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
});

// use destinationName and payloadString to access
// export const [SubscribeMessage, setSubscribeMessage] = useState(null);

const defaultConnectOptions = {
    reconnect: false,
    cleanSession: true,
    mqttVersion: 3,
    keepAliveInterval: 60,
    timeout: 60
};


export default class MQTT {
    constructor(ConnectOptions = null, SETTING = null, debug = false) {
        this.MQTTObject = null;
        this.QOS = 0;
        this.RETAIN = true;
        this.debug = debug;

        this.connect = this.connect.bind(this);
        this.subscribeTopic = this.subscribeTopic.bind(this);
        this.unsubscribeTopic = this.unsubscribeTopic.bind(this);
        this.send = this.send.bind(this);
        this.close = this.close.bind(this);
    }

    connect(host, port, usr, pass) {
        let currentTime = new Date();
        let clientID = currentTime + uuid.v1();
        clientID = clientID.slice(0, 23);
        console.log('clientID: ', clientID);

        this.MQTTObject = new Paho.MQTT.Client(host, port, clientID);

        this.MQTTObject.onConnectionLost = (res) => {
            console.log("Connection lost! ", res);
        };
        this.MQTTObject.onMessageArrived = (message) => {
            console.log("Message Arrived!: From ", message.destinationName);
            console.log("Message content: ", message.payloadString);
            this.SetResponseFunction(message);
        };
        this.MQTTObject.onMessageDelivered = (message) => {
            console.log("Message delivered!: ", message.payloadString);
        };

        this.MQTTObject.connect({
            onSuccess: () => {
                console.log("Connect succeed!");
                this.ConnectSuccessAction();
            },
            onFailure: (m) => {console.log("Connect failed! ", m)},
            userName: usr,
            password: pass,
            useSSL: false,
            ...defaultConnectOptions,
        });
    }

    subscribeTopic(topic) {
        console.log('MQTTConnection subscribe topic: ', topic);
        if (!this.MQTTObject || !this.MQTTObject.isConnected()) {
            if (this.debug) {
                console.log("Cannot subscribe topic!");
            }
            return;
        }
        this.MQTTObject.subscribe(topic, this.QOS);
    }
    
    unsubscribeTopic(topic) {
        console.log('MQTTConnection unsubscribe topic: ', topic)
        if (!this.MQTTObject || !this.MQTTObject.isConnected()) {
            if (this.debug) {
                console.log("Cannot unsubscribe topic!");
            }
            return;
        }
        this.MQTTObject.unsubscribe(topic);
    }
    
    send(topic = null, payload) {
        // console.log('MQTTConnection send: ')
        if (!this.MQTTObject || !this.MQTTObject.isConnected()) {
            if (this.debug) {
                console.log("Cannot publish to topic!");
                if (!this.MQTTObject) {
                    console.log("MQTT not available!");
                }
                else {
                    console.log("No payload!");
                }
            }
            return;
        }

        if (!topic || !payload) {
            if (this.debug) {
                console.log("There is no topic or payload!");
            }
            return false;
        }
        
        this.MQTTObject.publish(topic, payload, this.QOS, this.RETAIN);
    }

    close() {
        this.MQTTObject && this.MQTTObject.disconnect();
        this.MQTTObject = null;
    }

}

MQTT.prototype.SetResponseFunction = (message) => {
    console.log("No SetResponseFunction function available!");
}
MQTT.prototype.ConnectSuccessAction = () => {
    console.log("No ConnectSuccessAction function available!");
}