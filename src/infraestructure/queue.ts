import {connect} from "amqplib";

export const QueuePlugin = () => {
  return connect("amqp://admin:admin@localhost:5672");
}