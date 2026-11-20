// src/components/AddClientForm/AddClientForm.tsx
import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Select, Upload, Button, Checkbox, Row, Col, 
  Typography, Space, ConfigProvider, theme as antdTheme, 
  Card, Spin,  App 
} from 'antd';
import { 
  PlusOutlined, EyeInvisibleOutlined, EyeTwoTone, 
  UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined 
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { Option } = Select;

// ─── Types ───────────────────────────────────────────────────────────────────
interface ServiceOption {
  label: string;
  value: string;
}

interface FormOptions {
  service_days: ServiceOption[];
  time_slots: ServiceOption[];
  frequencies: ServiceOption[];
  client_statuses: ServiceOption[];
  services: ServiceOption[];
}

// API Response type that can include error
interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
}

interface NextOfKinData {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  postalCode?: string;
}

const AddClientForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ Use App context for message (fixes AntD warning)
  const { message: messageApi } = App.useApp();

  // ─── Fetch form options ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const response = await fetch('http://localhost/cleanPro/API/services/get_form_options.php');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: ApiResponse<FormOptions> = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (data.data) {
          setFormOptions(data.data);
        } else {
          // Fallback if response doesn't have data property
          setFormOptions(data as FormOptions);
        }
      } catch (error: any) {
        console.error("Failed to fetch form options:", error);
        messageApi.error(`Failed to load options: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormOptions();
  }, [messageApi]);

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const checkPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    setPasswordStrength(score);
  };

  // ─── SUBMIT FUNCTION (Fixed for PHP compatibility) ─────────────────────────
  const handleSubmit = async (isDraft: boolean) => {
    setIsSubmitting(true);
    
    try {
      // 1. Validate form
      const values = await form.validateFields();
      
      // 2. Validate at least one next of kin
      const kin1Name = values.nextOfKin1?.name;
      const kin2Name = values.nextOfKin2?.name;
      if (!kin1Name && !kin2Name) {
        messageApi.error('Please provide at least one emergency contact');
        setIsSubmitting(false);
        return;
      }

      // 3. Build FormData with EXACT field names your PHP expects
      const formData = new FormData();
      
      // Personal Info (match your PHP script variable names)
      formData.append('firstName', values.firstName?.trim() || '');
      formData.append('lastName', values.lastName?.trim() || '');
      formData.append('phone', values.phone?.trim() || '');
      formData.append('email', values.email?.trim() || '');
      formData.append('preferredName', values.preferredName?.trim() || '');
      formData.append('dob', values.dob || '');
      formData.append('street', values.street?.trim() || '');
      formData.append('city', values.city?.trim() || '');
      formData.append('state', values.state?.trim() || '');
      formData.append('postal', values.postal?.trim() || '');
      formData.append('country', values.country?.trim() || '');
      formData.append('gateNotes', values.gateNotes?.trim() || '');
      
      // Service Preferences
      formData.append('preferredDay', values.preferredDay || '');
      formData.append('preferredTime', values.preferredTime || '');
      formData.append('frequency', values.frequency || '');
      formData.append('status', values.status || 'Lead');
      
      // Services (JSON array)
      const services = Array.isArray(values.services) ? values.services : [];
      formData.append('services', JSON.stringify(services));
      
      // Next of Kin 1 (JSON object)
      const kin1: NextOfKinData = {
        name: values.nextOfKin1?.name?.trim() || '',
        relationship: values.nextOfKin1?.relationship?.trim() || '',
        phone: values.nextOfKin1?.phone?.trim() || '',
        email: values.nextOfKin1?.email?.trim() || '',
        address: values.nextOfKin1?.address?.trim() || '',
        postalCode: values.nextOfKin1?.postalCode?.trim() || '',
      };
      formData.append('nextOfKin1', JSON.stringify(kin1));
      
      // Next of Kin 2 (JSON object - only if name provided)
      const kin2: NextOfKinData = {
        name: values.nextOfKin2?.name?.trim() || '',
        relationship: values.nextOfKin2?.relationship?.trim() || '',
        phone: values.nextOfKin2?.phone?.trim() || '',
        email: values.nextOfKin2?.email?.trim() || '',
        address: values.nextOfKin2?.address?.trim() || '',
        postalCode: values.nextOfKin2?.postalCode?.trim() || '',
      };
      formData.append('nextOfKin2', kin2.name ? JSON.stringify(kin2) : JSON.stringify({}));
      
      // Account
      formData.append('username', values.username?.trim() || '');
      formData.append('password', values.password || '');
      
      // Notes & Flags
      formData.append('notes', values.notes?.trim() || '');
      formData.append('is_draft', isDraft ? '1' : '0'); // 1 = draft, 0 = registered
      
      // Profile Photo
      if (fileList[0]?.originFileObj) {
        formData.append('profilePhoto', fileList[0].originFileObj);
      }

      // 4. Send to API
      const response = await fetch('http://localhost/cleanPro/API/clients/register_client.php', {
        method: 'POST',
        body: formData,
      });

      // 5. Handle response
      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);
      
      let result: ApiResponse<any>;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Invalid JSON response:', responseText);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 200)}`);
      }

      if (response.ok && result?.success) {
        messageApi.success(result.message || 'Client registered successfully!');
        form.resetFields();
        setFileList([]);
        setPasswordStrength(0);
      } else {
        const errorMsg = result?.message || result?.error || `HTTP ${response.status}: ${response.statusText}`;
        console.error('❌ Submission failed:', result);
        messageApi.error(errorMsg);
      }

    } catch (error: any) {
      console.error('💥 Submission error:', error);
      if (error?.errorFields) {
        messageApi.error('Please fill in all required fields');
      } else if (error?.message?.includes('JSON')) {
        messageApi.error('Server error - check console for details');
      } else {
        messageApi.error(error?.message || 'Failed to submit. Check console for details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Light theme
  const lightTheme = {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#E91E63',
      colorPrimaryHover: '#f06292',
      colorSuccess: '#4CAF50',
      colorInfo: '#2196F3',
      colorError: '#ef4444',
      colorWarning: '#f59e0b',
      colorBgBase: '#faf9f7',
      colorBgContainer: '#ffffff',
      colorText: '#1f2937',
      colorTextSecondary: '#6b7280',
      colorBorder: '#d1d5db',
      borderRadius: 12,
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 14,
    },
    components: {
      Form: { labelColor: '#374151', itemMarginBottom: 20 },
      Input: { colorBgContainer: '#f9fafb', borderRadius: 10 },
      Select: { colorBgContainer: '#f9fafb', borderRadius: 10 },
      Button: { borderRadius: 10, fontWeight: 600 },
      Card: { colorBgContainer: '#ffffff' },
    },
  };

  // ─── Next of Kin Sub-Form ─────────────────────────────────────────────────
  const NextOfKinSubForm = ({ prefix, title, icon }: { prefix: string; title: string; icon: string }) => (
    <Card
      size="small"
      title={
        <Space>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <Text strong style={{ color: '#E91E63', fontSize: 14 }}>{title}</Text>
        </Space>
      }
      style={{
        background: '#faf9f7',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        marginBottom: 16,
      }}
      bodyStyle={{ padding: '16px 20px' }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[prefix, 'name']}
            label="Full Name *"
            rules={[{ required: prefix === 'nextOfKin1', message: 'Please enter name' }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="e.g. Jane Doe" prefix={<UserOutlined style={{ color: '#9ca3af' }} />} size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[prefix, 'relationship']}
            label="Relationship *"
            rules={[{ required: prefix === 'nextOfKin1', message: 'Please enter relationship' }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="e.g. Spouse, Parent" prefix={<UserOutlined style={{ color: '#9ca3af' }} />} size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[prefix, 'phone']}
            label="Phone Number *"
            rules={[{ required: prefix === 'nextOfKin1', message: 'Please enter phone' }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="+256 000 000000" prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />} size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[prefix, 'email']}
            label="Email Address"
            rules={[{ type: 'email', message: 'Please enter valid email' }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="contact@example.com" prefix={<MailOutlined style={{ color: '#9ca3af' }} />} size="large" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name={[prefix, 'address']}
            label="Address"
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="Street, Building, Area" prefix={<HomeOutlined style={{ color: '#9ca3af' }} />} size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[prefix, 'postalCode']}
            label="Postal Code"
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="00000" size="large" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  return (
    // ✅ Wrap with App to fix message context warning
    <App>
      <ConfigProvider theme={lightTheme}>
        <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
          <div style={{ width: '100%' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Header */}
              <Row align="middle" gutter={16}>
                <Col>
                  <div style={{
                    width: 52, height: 52,
                    background: 'linear-gradient(135deg, #E91E63, #f06292)',
                    borderRadius: 14, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 24, color: 'white',
                    boxShadow: '0 4px 14px rgba(233,30,99,0.25)',
                  }}>🧹</div>
                </Col>
                <Col flex="auto">
                  <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Add New Client</Title>
                  <Text style={{ color: '#6b7280', fontSize: 14 }}>CleanPro Management System</Text>
                </Col>
              </Row>

              {/* Main Card */}
              <div style={{
                background: '#ffffff', borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb',
              }}>
                <Form form={form} layout="vertical" style={{ padding: 0 }}>
                  {/* Personal Information */}
                  <div style={{ padding: '28px 32px', borderBottom: '1px solid #e5e7eb' }}>
                    <Row align="middle" gutter={12} style={{ marginBottom: 20 }}>
                      <Col><div style={{ fontSize: 18, color: '#E91E63' }}>👤</div></Col>
                      <Col>
                        <Title level={5} style={{ margin: 0, color: '#E91E63', fontWeight: 600 }}>
                          PERSONAL INFORMATION
                        </Title>
                      </Col>
                    </Row>

                    <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
                      <Col>
                        <Upload name="avatar" listType="picture-circle" fileList={fileList}
                          onChange={handleUploadChange} maxCount={1} beforeUpload={() => false}>
                          {fileList.length < 1 && (
                            <div style={{ textAlign: 'center' }}>
                              <PlusOutlined style={{ fontSize: 24, color: '#9ca3af' }} />
                              <div style={{ marginTop: 4, fontSize: 12, color: '#6b7280' }}>Upload</div>
                            </div>
                          )}
                        </Upload>
                      </Col>
                      <Col flex="auto">
                        <Text style={{ color: '#4b5563', display: 'block', marginBottom: 8 }}>
                          Client profile photo (optional)
                        </Text>
                      </Col>
                    </Row>

                    <Row gutter={[16, 20]}>
                      <Col xs={24} sm={12}>
                        <Form.Item name="firstName" label="First Name *" rules={[{ required: true }]}>
                          <Input placeholder="e.g. Sarah" size="large" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="lastName" label="Last Name *" rules={[{ required: true }]}>
                          <Input placeholder="e.g. Johnson" size="large" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="phone" label="Phone Number *" rules={[{ required: true }]}>
                          <Input placeholder="+256 000 000000" size="large" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="email" label="Email Address *" rules={[{ required: true, type: 'email' }]}>
                          <Input placeholder="sarah@example.com" size="large" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="preferredName" label="Preferred Name *" rules={[{ required: true }]}>
                          <Input placeholder="e.g. Sarah" size="large" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="dob" label="Date of Birth">
                          <Input type="date" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>

                  {/* Address Details */}
                  <div style={{ padding: '28px 32px', borderBottom: '1px solid #e5e7eb' }}>
                    <Row align="middle" gutter={12} style={{ marginBottom: 20 }}>
                      <Col><div style={{ fontSize: 18, color: '#E91E63' }}>🏠</div></Col>
                      <Col>
                        <Title level={5} style={{ margin: 0, color: '#E91E63', fontWeight: 600 }}>
                          ADDRESS DETAILS
                        </Title>
                      </Col>
                    </Row>

                    <Form.Item name="street" label="Street Address *" rules={[{ required: true }]}>
                      <Input placeholder="123 Maple Street, Apt 4B" size="large" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item name="city" label="City *" rules={[{ required: true }]}>
                          <Input placeholder="City" size="large" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="state" label="State / Province">
                          <Input placeholder="State" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item name="postal" label="Postal Code">
                          <Input placeholder="00000" size="large" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="country" label="Country">
                          <Input placeholder="Country" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="gateNotes" label="Special Access / Gate Notes">
                      <Input.TextArea placeholder="Gate code, pets, etc." rows={3} size="large" />
                    </Form.Item>
                  </div>

                  {/* Service Preferences */}
                  <div style={{ padding: '28px 32px', borderBottom: '1px solid #e5e7eb' }}>
                    <Row align="middle" gutter={12} style={{ marginBottom: 20 }}>
                      <Col><div style={{ fontSize: 18, color: '#E91E63' }}>🧹</div></Col>
                      <Col>
                        <Title level={5} style={{ margin: 0, color: '#E91E63', fontWeight: 600 }}>
                          SERVICE PREFERENCES
                        </Title>
                      </Col>
                    </Row>

                    {isLoading ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" tip="Loading options..." />
                      </div>
                    ) : (
                      <>
                        <Row gutter={16}>
                          <Col xs={24} sm={12}>
                            <Form.Item name="preferredDay" label="Preferred Service Day">
                              <Select placeholder="Any day" size="large" allowClear>
                                <Option value="">Any day</Option>
                                {formOptions?.service_days.map(day => (
                                  <Option key={day.value} value={day.value}>{day.label}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item name="preferredTime" label="Preferred Time Slot">
                              <Select placeholder="Flexible" size="large" allowClear>
                                <Option value="">Flexible</Option>
                                {formOptions?.time_slots.map(slot => (
                                  <Option key={slot.value} value={slot.value}>{slot.label}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16} style={{ marginTop: 8 }}>
                          <Col xs={24} sm={12}>
                            <Form.Item name="frequency" label="Service Frequency">
                              <Select size="large">
                                {formOptions?.frequencies.map(freq => (
                                  <Option key={freq.value} value={freq.value}>{freq.label}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item name="status" label="Client Status">
                              <Select size="large">
                                {formOptions?.client_statuses.map(status => (
                                  <Option key={status.value} value={status.value}>{status.label}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label="Services Required" style={{ marginTop: 24 }}>
                          <Checkbox.Group 
                            options={formOptions?.services.map(s => ({ label: s.label, value: s.value }))} 
                            style={{ width: '100%' }} 
                          />
                        </Form.Item>
                      </>
                    )}
                  </div>

                  {/* Next of Kin */}
                  <div style={{ padding: '28px 32px', borderBottom: '1px solid #e5e7eb', background: '#faf9f7' }}>
                    <Row align="middle" gutter={12} style={{ marginBottom: 20 }}>
                      <Col><div style={{ fontSize: 18, color: '#E91E63' }}>👥</div></Col>
                      <Col>
                        <Title level={5} style={{ margin: 0, color: '#E91E63', fontWeight: 600 }}>
                          NEXT OF KIN / EMERGENCY CONTACTS
                        </Title>
                      </Col>
                    </Row>
                    <Text style={{ color: '#6b7280', display: 'block', marginBottom: 20, fontSize: 13 }}>
                      Please provide details for up to two emergency contacts. At least one contact is required.
                    </Text>

                    <NextOfKinSubForm prefix="nextOfKin1" title="Primary Contact (Required)" icon="🔹" />
                    <NextOfKinSubForm prefix="nextOfKin2" title="Secondary Contact (Optional)" icon="🔸" />
                  </div>

                  {/* Account & Login */}
                  <div style={{ padding: '28px 32px' }}>
                    <Row align="middle" gutter={12} style={{ marginBottom: 20 }}>
                      <Col><div style={{ fontSize: 18, color: '#E91E63' }}>🔐</div></Col>
                      <Col>
                        <Title level={5} style={{ margin: 0, color: '#E91E63', fontWeight: 600 }}>
                          ACCOUNT & LOGIN
                        </Title>
                      </Col>
                    </Row>

                    <Form.Item name="username" label="Username / Login Email *" rules={[{ required: true }]}>
                      <Input placeholder="This will be used to log in" size="large" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item name="password" label="Password *" rules={[{ required: true }]}>
                          <Input.Password size="large" placeholder="Create a password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onChange={(e) => checkPasswordStrength(e.target.value)} />
                        </Form.Item>
                        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                          {Array(4).fill(0).map((_, i) => (
                            <div key={i} style={{
                              height: 4, flex: 1, borderRadius: 2,
                              background: i < passwordStrength
                                ? ['#ef4444', '#f59e0b', '#eab308', '#10b981'][Math.min(passwordStrength - 1, 3)]
                                : '#e5e7eb',
                            }} />
                          ))}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Password strength: {['Weak', 'Fair', 'Good', 'Strong'][Math.max(0, passwordStrength - 1)] || 'None'}
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="confirmPassword" label="Confirm Password *" rules={[
                          { required: true },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) return Promise.resolve();
                              return Promise.reject(new Error('Passwords do not match'));
                            },
                          }),
                        ]}>
                          <Input.Password size="large" placeholder="Repeat password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="notes" label="Additional Notes">
                      <Input.TextArea rows={4} placeholder="Special instructions, allergies, pets…" size="large" />
                    </Form.Item>
                  </div>

                  {/* Footer Buttons */}
                  <div style={{
                    padding: '24px 32px', background: '#f9fafb',
                    borderTop: '1px solid #e5e7eb', display: 'flex',
                    gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap',
                  }}>
                    <Button size="large" onClick={() => form.resetFields()} disabled={isSubmitting}>Cancel</Button>
                    <Button size="large" onClick={() => handleSubmit(true)} loading={isSubmitting} disabled={isSubmitting}>
                      💾 Save as Draft
                    </Button>
                    <Button type="primary" size="large" loading={isSubmitting} onClick={() => handleSubmit(false)}>
                      ✅ Register Client
                    </Button>
                  </div>
                </Form>
              </div>
            </Space>
          </div>
        </div>
      </ConfigProvider>
    </App>
  );
};

export default AddClientForm;