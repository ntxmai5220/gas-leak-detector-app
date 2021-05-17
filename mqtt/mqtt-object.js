import {AsyncStorage} from "react-native";
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
    constructor(debug = false) {
        this.mqtt = null;
        this.QOS = 0;
        this.RETAIN = true;
        this.debug = debug;
    }

    connect(host, port, usr, pass) {
        let currentTime = new Date();
        let clientID = currentTime + uuid.v1();
        clientID = clientID.slice(0, 23);
        console.log('clientID: ', clientID);

        this.mqtt = new Paho.MQTT.Client(host, port, clientID);

        this.mqtt.onConnectionLost = (res) => {
            console.log("Connection lost! ", res);
        };
        this.mqtt.onMessageArrived = (message) => {
            if (this.debug) {
                console.log("Message arrived!: ", message.payloadString);
            }
            // g.message = message;
            this.onMQTTMessageArrived(message);
        };
        this.mqtt.onMessageDelivered = (message) => {
            if (this.debug) {
                console.log("Message delivered! ", message);
            } else {
                console.log("Message delivered!");
            }
        };

        this.mqtt.connect({
            onSuccess: () => {console.log("Connect succeed!")},
            onFailure: (m) => {console.log("Connect failed! ", m)},
            userName: usr,
            password: pass,
            useSSL: false,
            ...defaultConnectOptions,
        });
    }

    subscribeTopic(topic) {
        console.log('MQTTConnection subscribe topic: ', topic);
        if (!this.mqtt || !this.mqtt.isConnected()) {
            if (this.debug) {
                console.log("Cannot subscribe topic!");
            }
            return;
        }
        this.mqtt.subscribe(topic, this.QOS);
    }
    
    unsubscribeTopic(topic) {
        console.log('MQTTConnection unsubscribe topic: ', topic)
        if (!this.mqtt || !this.mqtt.isConnected()) {
            if (this.debug) {
                console.log("Cannot unsubscribe topic!");
            }
            return;
        }
        this.mqtt.unsubscribe(topic);
    }

    // setSubFunction(func) {
    //     this.f = func;
    // }
    
    send(topic = null, payload) {
        // console.log('MQTTConnection send: ')
        if (!this.mqtt || !this.mqtt.isConnected()) {
            if (this.debug) {
                console.log("Cannot publish to topic!");
                if (!this.mqtt) {
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
        // console.log(`MQTTConnection send publish topic: ${topic}, payload: ${payload} qos: ${this.QOS} retained: ${this.RETAIN}`)
        this.mqtt.publish(topic, payload, this.QOS, this.RETAIN);
    }

    close() {
        this.mqtt && this.mqtt.disconnect();
        this.mqtt = null;
    }

}

MQTT.prototype.onMQTTMessageArrived = null