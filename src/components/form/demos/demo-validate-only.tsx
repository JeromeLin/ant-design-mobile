import React from 'react'
import { Form, Input, Button } from 'antd-mobile'

export default () => {
  const [form] = Form.useForm()

  // Watch all values to trigger re-validation
  const values = Form.useWatch([], form)

  const [submittable, setSubmittable] = React.useState(false)

  React.useEffect(() => {
    let isCurrent = true
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        if (isCurrent) {
          setSubmittable(true)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setSubmittable(false)
        }
      })
    return () => {
      isCurrent = false
    }
  }, [form, values])

  return (
    <Form
      form={form}
      footer={
        <Button
          block
          type='submit'
          color='primary'
          size='large'
          disabled={!submittable}
        >
          提交
        </Button>
      }
    >
      <Form.Header>静默校验</Form.Header>
      <Form.Item
        name='name'
        label='姓名'
        rules={[{ required: true, message: '姓名不能为空' }]}
      >
        <Input placeholder='请输入姓名' />
      </Form.Item>
      <Form.Item
        name='email'
        label='邮箱'
        rules={[
          { required: true, message: '邮箱不能为空' },
          { type: 'email', message: '请输入正确的邮箱格式' },
        ]}
      >
        <Input placeholder='请输入邮箱' />
      </Form.Item>
    </Form>
  )
}
