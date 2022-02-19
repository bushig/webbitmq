import React, { FC, useState } from "react";

import { useNavigate } from "react-router";
import { createQueque, QueueData } from "../../utils/api";


const fastRabbitAddressOptions = [
  {
    label: "стейдж",
    value: "stage"
  }
];
// TODO: finish component
const RabbitForm: FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [rabbitAddress, setRabbitAddress] = useState<string>("");
  const [exchangeName, setExchangeName] = useState<string>("");
  const [queueLifetimeMinutes, setQueueLifetimeMinutes] = useState<number>(1);
  const [routingKey, setRoutingKey] = useState<string>("");

  const handleFastLinkClick = (e) => {
    setRabbitAddress(e.value);
  };
  const handleRabbitAddressChange = (e) => {
    setRabbitAddress(e.target.value);
  };
  const handleExchangeNameChange = (e) => {
    setExchangeName(e.target.value);
  };

  const handleRoutingKeyChange = (e: any, actionMeta: any) => {
    setRoutingKey(e.target.value);
  };
  const handleQueueLifetimeMinutesChange = (e: any, actionMeta: any) => {
    setQueueLifetimeMinutes(e.target.value);
  };

  const sendRequest = async () => {
    setLoading(true);
    try {
      const data: QueueData = {
        rabbit_env: rabbitAddress,
        exchange_name: exchangeName,
        routing_key: routingKey || "*",
        ttl: queueLifetimeMinutes
      };
      const key = await createQueque(data);
      // history.push(`/queue/${key}`);
      window.open(`/queue/${key}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.toString());
      setLoading(false);
    }
  };

  return (
    <form>
      {/*<Shape shadow>*/}
      {/*  <Section title="RabbitMQ listener">*/}
      {/*    <Row contentType="input" label="Адрес сервера" isRequired>*/}
      {/*      <Field size="small">*/}
      {/*        <InputField*/}
      {/*          placeholder=""*/}
      {/*          value={rabbitAddress}*/}
      {/*          onChange={handleRabbitAddressChange}*/}
      {/*          name="rabbit_address"*/}
      {/*        />*/}
      {/*        {!rabbitAddress && (*/}
      {/*          <FastLinks*/}
      {/*            onClick={handleFastLinkClick}*/}
      {/*            options={fastRabbitAddressOptions}*/}
      {/*          />*/}
      {/*        )}*/}
      {/*      </Field>*/}
      {/*    </Row>*/}
      {/*    <Row contentType="input" label="Exchange" isRequired>*/}
      {/*      <Field size="small">*/}
      {/*        <InputField*/}
      {/*          placeholder=""*/}
      {/*          value={exchangeName}*/}
      {/*          onChange={handleExchangeNameChange}*/}
      {/*          name="exchange_name"*/}
      {/*        />*/}
      {/*      </Field>*/}
      {/*    </Row>*/}
      {/*    <Row contentType="input" label="routing key" isRequired>*/}
      {/*      <Field size="large">*/}
      {/*        <InputField*/}
      {/*          inputValue={routingKey}*/}
      {/*          onChange={handleRoutingKeyChange}*/}
      {/*          name="routing_key"*/}
      {/*          placeholder="Например ati.notifications.*"*/}
      {/*        />*/}
      {/*      </Field>*/}
      {/*    </Row>*/}
      {/*    <Row*/}
      {/*      contentType="input"*/}
      {/*      label="Время жизни очереди"*/}
      {/*      isRequired*/}
      {/*      labelTop*/}
      {/*      inline*/}
      {/*    >*/}
      {/*      <Field size="xsmall">*/}
      {/*        <InputField*/}
      {/*          after="мин."*/}
      {/*          value={queueLifetimeMinutes}*/}
      {/*          onChange={handleQueueLifetimeMinutesChange}*/}
      {/*        />*/}
      {/*      </Field>*/}
      {/*    </Row>*/}
      {/*    <div className={styles.error}>{error}</div>*/}
      {/*  </Section>*/}
      {/*  <FormFooter>*/}
      {/*    <Button*/}
      {/*      text="Слушать очередь"*/}
      {/*      onClick={sendRequest}*/}
      {/*      isLoading={isLoading}*/}
      {/*    />*/}
      {/*  </FormFooter>*/}
      {/*</Shape>*/}
    </form>
  );
};

export default RabbitForm;
