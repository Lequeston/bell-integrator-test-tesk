import React, { useEffect, useState } from 'react';
import { Layout, List, Checkbox, Form, Input, Button} from 'antd';

import styles from './App.module.css';
import { v4 as uuidv4 } from 'uuid';
const { Content, Footer, Header } = Layout;

interface Item {
  id: string;
  title: string;
  content: string;
  checked: boolean;
}

interface FieldType {
  title?: string;
  content?: string;
};

/*
const data= Array.from({ length: 23 }).map((_, i): Item => ({
  id: `id ${i}`,
  title: `Название ${i}`,
  content: `Контент: ${i}`,
}));*/

const LOCAL_STORAGE_KEY = 'TEST_KEY';

// по компонентам раскидать не успел
const App = () => {
  const [values, setValues] = useState<Item[] | null>(null);
  useEffect(() => {
    const stringValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stringValue) {
      const items = JSON.parse(stringValue);
      // тут непомешает DTO если успею
      setValues(items as Item[]);
    }
  }, []);
  const handleChange = (checked: boolean, id: string) => {
    setValues((prevValues) => {
      if (prevValues === null) {
        return prevValues;
      }
      const changeValue = prevValues.find(value => value.id === id);
      if (!changeValue) {
        return prevValues;
      }
      // грязно сделано знаю, но времени нет
      changeValue.checked = checked;
      return [...prevValues];
    })
  };
  const handleFinish = (value: any) => {
    setValues((prevValues) => [...(prevValues || []), {
      id: uuidv4(),
      title: value.title,
      content: value.content,
      checked: false,
    }])
  };

  useEffect(() => {
    if (values !== null) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
    }
  }, [values]);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>Чек-лист</Header>
      <Content>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Название"
          name="title"
          rules={[{ required: true, message: 'Пожалуйста, введите название задачи' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Описание"
          name="content"
          rules={[{ required: true, message: 'Пожалуйста введите описание' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
        <List<Item>
          className={styles.list}
          size="large"
          itemLayout="vertical"
          dataSource={values || []}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 5,
          }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className={styles.item}
            >
              <List.Item.Meta
                title={<Checkbox checked={item.checked} onChange={(e) => handleChange(e.target.checked, item.id)}>{item.title}</Checkbox>}
              />
              {item.content}
            </List.Item>
          )}
        />
      </Content>
      <Footer>Kirill Logachev ©2023</Footer>
    </Layout>
  );
}

export default App;
