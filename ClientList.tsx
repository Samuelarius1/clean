// src/components/admin/clients/ClientList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  ConfigProvider,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Avatar,
  Modal,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  List,
  Table,
  Tooltip,
  theme as antdTheme,
  Empty,
  Statistic,
  Pagination,
  Spin,
  message,
  App,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MobileOutlined,
  AppstoreOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ClockCircleFilled,
  CloseCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Client {
  id: number;
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'pending' | 'inactive';
  isDraft: boolean;
  services: string[];
  frequency: string;
  avatar: string | null;
  initials: string;
  joinedDate: string;
  nextService: string;
  color: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    clients?: Client[];
    client?: Client;
    pagination?: PaginationInfo;
  };
}

interface StatusConfig {
  label: string;
  bg: string;
  color: string;
  dot: string;
  icon: React.ReactNode;
}

// ─── API Configuration ────────────────────────────────────────────────────────
const API_BASE = 'http://localhost/cleanPro/API/clients/get_clients.php';
const ITEMS_PER_PAGE = 12;

// ─── Status Config ───────────────────────────────────────────────────────────
const statusConfig: Record<string, StatusConfig> = {
  active: {
    label: 'Active',
    bg: '#d1fae5',
    color: '#065f46',
    dot: '#10b981',
    icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
  },
  pending: {
    label: 'Pending',
    bg: '#fef3c7',
    color: '#92400e',
    dot: '#f59e0b',
    icon: <ClockCircleFilled style={{ color: '#f59e0b' }} />,
  },
  inactive: {
    label: 'Inactive',
    bg: '#f3f4f6',
    color: '#6b7280',
    dot: '#9ca3af',
    icon: <CloseCircleFilled style={{ color: '#9ca3af' }} />,
  },
};

const servicesAbbr: Record<string, string> = {
  'Regular Clean': '🧹',
  'Deep Clean': '🧽',
  'Laundry': '👕',
  'Carpet Clean': '🪣',
  'Window Wash': '🪟',
  'Move-In/Out': '📦',
  'Office Clean': '🏢',
  'Post-Event': '🎉',
};

// ─── Ant Design Theme ─────────────────────────────────────────────────────────
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
    colorBgElevated: '#ffffff',
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    colorBorder: '#d1d5db',
    borderRadius: 12,
    fontFamily: '"DM Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 14,
  },
  components: {
    Button: { borderRadius: 10, fontWeight: 600 },
    Card: { borderRadius: 16 },
    Input: { borderRadius: 10 },
    Select: { borderRadius: 10 },
    Modal: { borderRadius: 20 },
    Tag: { borderRadius: 20 },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ClientList: React.FC = () => {
  const { message: messageApi } = App.useApp?.() || { message: { success: message.success, error: message.error, warning: message.warning } };
  
  // ─── State ─────────────────────────────────────────────────────────────────
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sortBy, setSortBy] = useState<'last_name' | 'client_status' | 'city'>('last_name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  // ─── Pagination State ──────────────────────────────────────────────────────
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });

  // ─── Fetch Clients from Backend ────────────────────────────────────────────
  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterType === 'draft') params.append('type', 'draft');
      else if (filterType === 'saved') params.append('type', 'saved');
      params.append('sortBy', sortBy);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`${API_BASE}?${params}`);
      const result: ApiResponse = await response.json();

      if (result.success && result.data?.clients) {
        setClients(result.data.clients);
        if (result.data.pagination) {
          setPagination(result.data.pagination);
        }
      } else {
        messageApi?.error?.(result.message || 'Failed to load clients') || message.error(result.message || 'Failed to load clients');
        setClients([]);
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      messageApi?.error?.('Network error. Please check your connection.') || message.error('Network error. Please check your connection.');
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterType, sortBy, pagination.page, pagination.limit, messageApi]);

  // ─── Load clients on mount and when filters change ─────────────────────────
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // ─── Reset to page 1 when search/filters change ────────────────────────────
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [search, filterStatus, filterType, sortBy]);

  // ─── Action: Delete Client ─────────────────────────────────────────────────
  const handleDelete = async (client: Client) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: client.id }),
      });
      const result: ApiResponse = await response.json();

      if (result.success) {
        messageApi?.success?.(result.message) || message.success(result.message);
        fetchClients();
        setIsDeleteModalOpen(false);
        setClientToDelete(null);
      } else {
        messageApi?.error?.(result.message || 'Failed to delete client') || message.error(result.message || 'Failed to delete');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      messageApi?.error?.('Network error while deleting') || message.error('Network error while deleting');
    }
  };

  // ─── Action: Complete Registration (Draft → Registered) ────────────────────
  const handleCompleteRegistration = async (client: Client) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete_registration', id: client.id, status: 'active' }),
      });
      const result: ApiResponse = await response.json();

      if (result.success) {
        messageApi?.success?.(result.message) || message.success(result.message);
        fetchClients();
        setIsModalOpen(false);
        setSelectedClient(null);
      } else {
        messageApi?.error?.(result.message || 'Failed to complete registration') || message.error(result.message || 'Failed');
      }
    } catch (error: any) {
      console.error('Complete registration error:', error);
      messageApi?.error?.('Network error') || message.error('Network error');
    }
  };

  // ─── Action: Edit Client ───────────────────────────────────────────────────
  const handleEdit = (client: Client) => {
    messageApi?.info?.(`Edit client: ${client.firstName} ${client.lastName}`) || message.info(`Edit: ${client.firstName}`);
  };

  // ─── Render Helpers ────────────────────────────────────────────────────────
  const renderStatusTag = (status: Client['status']) => {
    const cfg = statusConfig[status];
    return (
      <Tag
        style={{
          backgroundColor: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.dot}`,
          fontWeight: 600,
          fontSize: 12,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cfg.dot, display: 'inline-block' }} />
        {cfg.label}
      </Tag>
    );
  };

  const renderServiceTags = (services: string[]) => (
    <Space wrap size={[4, 4]}>
      {services.map((s) => (
        <Tag key={s} color="default" style={{ fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          {servicesAbbr[s]} {s}
        </Tag>
      ))}
    </Space>
  );

  // ─── Table Columns (for List View) ─────────────────────────────────────────
  const columns: ColumnsType<Client> = [
    {
      title: 'Client',
      key: 'client',
      render: (_, client) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: `${client.color}18`,
              border: `2px solid ${client.color}40`,
              color: client.color,
              fontWeight: 700,
            }}
            size={38}
            src={client.avatar || undefined}
          >
            {!client.avatar && client.initials}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 14 }}>
              {client.firstName} {client.lastName}
              {client.isDraft && (
                <Tag color="warning" style={{ marginLeft: 6, fontSize: 10 }}>
                  DRAFT
                </Tag>
              )}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {client.frequency}
            </Text>
          </div>
        </Space>
      ),
      responsive: ['sm'],
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, client) => (
        <div>
          <Text style={{ fontSize: 13 }}>{client.email}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {client.phone}
          </Text>
        </div>
      ),
      responsive: ['md'],
    },
    {
      title: 'Location',
      dataIndex: 'city',
      key: 'city',
      render: (city) => (
        <Space>
          <EnvironmentOutlined />
          <Text style={{ fontSize: 13 }}>{city}</Text>
        </Space>
      ),
      responsive: ['lg'],
    },
    {
      title: 'Services',
      key: 'services',
      render: (_, client) => <Space wrap size={[4, 4]}>{renderServiceTags(client.services)}</Space>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Client['status']) => renderStatusTag(status),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, client) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(client);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={(e) => {
                e.stopPropagation();
                setClientToDelete(client);
                setIsDeleteModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <App>
      <ConfigProvider theme={lightTheme}>
        <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#faf9f7', minHeight: '100vh', padding: '16px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* ── Header ── */}
            <Row align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col flex="auto">
                <Title level={3} style={{ margin: 0, fontSize: 20 }}>
                  Client Management
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  CleanPro Management System
                </Text>
              </Col>
              <Col xs={24} sm="auto">
                <Space wrap>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchClients}
                    loading={loading}
                    size="large"
                    style={{ borderRadius: 10 }}
                  >
                    Refresh
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #E91E63, #f06292)',
                      borderColor: '#E91E63',
                      fontWeight: 600,
                      borderRadius: 10,
                    }}
                    onClick={() => {
                      messageApi?.info?.('Navigate to Add Client form') || message.info('Add Client');
                    }}
                  >
                    Add Client
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* ── Stats Cards ── */}
            <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
              {[
                { label: 'Total Clients', value: pagination.total, icon: '👥', color: '#E91E63', bg: '#fde8f0' },
                { label: 'Registered', value: pagination.total - clients.filter(c => c.isDraft).length, icon: '✅', color: '#059669', bg: '#d1fae5' },
                { label: 'Drafts', value: clients.filter(c => c.isDraft).length, icon: '📝', color: '#D97706', bg: '#fef3c7' },
                { label: 'Active', value: clients.filter(c => c.status === 'active').length, icon: '⚡', color: '#7C3AED', bg: '#ede9fe' },
              ].map((stat) => (
                <Col xs={12} sm={6} key={stat.label}>
                  <Card size="small" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14 }} bodyStyle={{ padding: '12px 16px' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <div>
                        <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</Text>
                        <Statistic value={stat.value} valueStyle={{ fontSize: 24, fontWeight: 700, color: '#1f2937', margin: 0 }} />
                      </div>
                      <div style={{ background: stat.bg, borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        {stat.icon}
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* ── Filters & Search ── */}
            <Card style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', marginBottom: 16 }} bodyStyle={{ padding: '16px' }}>
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                <Input
                  placeholder="Search by name, email, or city…"
                  prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                  size="large"
                  style={{ borderRadius: 10 }}
                  onPressEnter={fetchClients}
                />

                <Row gutter={[8, 8]} align="middle">
                  <Col xs={24} lg={16}>
                    <Space wrap size={[6, 6]}>
                      {[
                        { key: 'all', label: 'All' },
                        { key: 'saved', label: '✅ Registered' },
                        { key: 'draft', label: '📝 Drafts' },
                      ].map((f) => (
                        <Button
                          key={f.key}
                          size="small"
                          type={filterType === f.key ? 'primary' : 'default'}
                          onClick={() => setFilterType(f.key)}
                          style={{
                            borderRadius: 20,
                            fontWeight: 500,
                            fontSize: 13,
                            background: filterType === f.key ? '#E91E63' : undefined,
                            borderColor: filterType === f.key ? '#E91E63' : undefined,
                          }}
                        >
                          {f.label}
                        </Button>
                      ))}
                      <Divider type="vertical" style={{ height: 20, margin: '0 4px' }} />
                      {['all', 'active', 'pending', 'inactive'].map((s) => {
                        const cfg = statusConfig[s];
                        return (
                          <Button
                            key={s}
                            size="small"
                            type={filterStatus === s ? 'primary' : 'default'}
                            onClick={() => setFilterStatus(s)}
                            style={{
                              borderRadius: 20,
                              fontWeight: 500,
                              fontSize: 13,
                              background: filterStatus === s ? (s === 'all' ? '#1f2937' : cfg?.bg) : undefined,
                              color: filterStatus === s ? (s === 'all' ? '#fff' : cfg?.color) : undefined,
                              borderColor: filterStatus === s && s !== 'all' ? cfg?.dot : undefined,
                            }}
                          >
                            {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                          </Button>
                        );
                      })}
                    </Space>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Space wrap style={{ justifyContent: 'flex-end', width: '100%' }}>
                      <Select
                        value={sortBy}
                        onChange={(v) => setSortBy(v)}
                        size="small"
                        style={{ width: 140, borderRadius: 8 }}
                        options={[
                          { value: 'last_name', label: 'Sort: Name' },
                          { value: 'client_status', label: 'Sort: Status' },
                          { value: 'city', label: 'Sort: City' },
                        ]}
                      />
                      <Button.Group size="small">
                        <Button
                          icon={<AppstoreOutlined />}
                          type={viewMode === 'cards' ? 'primary' : 'default'}
                          onClick={() => setViewMode('cards')}
                          style={{ borderRadius: '8px 0 0 8px' }}
                        />
                        <Button
                          icon={<MobileOutlined />}
                          type={viewMode === 'list' ? 'primary' : 'default'}
                          onClick={() => setViewMode('list')}
                          style={{ borderRadius: '0 8px 8px 0' }}
                        />
                      </Button.Group>
                    </Space>
                  </Col>
                </Row>
              </Space>
            </Card>

            {/* ── Results Count ── */}
            <Text type="secondary" style={{ fontSize: 13, marginBottom: 12, display: 'block' }}>
              Showing <strong style={{ color: '#E91E63' }}>{clients.length}</strong> of {pagination.total} clients
            </Text>

            {/* ── Loading State ── */}
            {loading && clients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Spin size="large" description="Loading clients..." />
              </div>
            ) : (
              <>
                {/* ── Card View ── */}
                {viewMode === 'cards' && (
                  <List
                    grid={{ gutter: 14, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                    dataSource={clients}
                    renderItem={(client) => (
                      <List.Item>
                        <Card
                          hoverable
                          onClick={() => {
                            setSelectedClient(client);
                            setIsModalOpen(true);
                          }}
                          style={{
                            border: `1.5px solid ${client.isDraft ? '#fde68a' : '#e5e7eb'}`,
                            boxShadow: client.isDraft ? '0 4px 14px rgba(245,158,11,0.1)' : '0 4px 14px rgba(0,0,0,0.06)',
                            borderRadius: 16,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                          cover={<div style={{ height: 5, background: `linear-gradient(90deg, ${client.color}, ${client.color}88)` }} />}
                          bodyStyle={{ padding: '18px' }}
                        >
                          {client.isDraft && (
                            <Tag color="warning" style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, padding: '2px 8px' }}>
                              📝 DRAFT
                            </Tag>
                          )}

                          <Space style={{ marginBottom: 14, width: '100%' }} align="start">
                            <Avatar
                              size={48}
                              style={{
                                backgroundColor: `${client.color}18`,
                                border: `2px solid ${client.color}40`,
                                color: client.color,
                                fontWeight: 700,
                                fontSize: 16,
                              }}
                              src={client.avatar || undefined}
                            >
                              {!client.avatar && client.initials}
                            </Avatar>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Text strong style={{ fontSize: 15, display: 'block' }}>
                                {client.firstName} {client.lastName}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Preferred: <em>{client.preferredName}</em>
                              </Text>
                            </div>
                          </Space>

                          <div style={{ marginBottom: 12 }}>{renderStatusTag(client.status)}</div>

                          <Space orientation="vertical" size="small" style={{ width: '100%', marginBottom: 14 }}>
                            <Space>
                              <MailOutlined style={{ color: '#9ca3af' }} />
                              <Text ellipsis style={{ fontSize: 12, maxWidth: 180 }}>
                                {client.email}
                              </Text>
                            </Space>
                            <Space>
                              <PhoneOutlined style={{ color: '#9ca3af' }} />
                              <Text style={{ fontSize: 12 }}>{client.phone}</Text>
                            </Space>
                            <Space>
                              <EnvironmentOutlined style={{ color: '#9ca3af' }} />
                              <Text style={{ fontSize: 12 }}>
                                {client.city} · {client.frequency}
                              </Text>
                            </Space>
                          </Space>

                          <div style={{ marginBottom: 14 }}>{renderServiceTags(client.services)}</div>

                          {!client.isDraft ? (
                            <Row justify="space-between">
                              <Col>
                                <Text style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase' }}>Joined</Text>
                                <Text strong style={{ fontSize: 12, display: 'block' }}>{client.joinedDate}</Text>
                              </Col>
                              <Col style={{ textAlign: 'right' }}>
                                <Text style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase' }}>Next Service</Text>
                                <Text strong style={{ fontSize: 12, display: 'block', color: client.status === 'active' ? '#059669' : '#9ca3af' }}>
                                  {client.nextService}
                                </Text>
                              </Col>
                            </Row>
                          ) : (
                            <Button
                              type="primary"
                              block
                              size="small"
                              style={{
                                background: 'linear-gradient(135deg, #E91E63, #f06292)',
                                borderColor: '#E91E63',
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 13,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteRegistration(client);
                              }}
                            >
                              Complete Registration →
                            </Button>
                          )}
                        </Card>
                      </List.Item>
                    )}
                    locale={{
                      emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No clients found" />,
                    }}
                  />
                )}

                {/* ── List/Table View ── */}
                {viewMode === 'list' && (
                  <Table
                    columns={columns}
                    dataSource={clients}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    loading={loading}
                    onRow={(record) => ({
                      onClick: () => {
                        setSelectedClient(record);
                        setIsModalOpen(true);
                      },
                      style: { cursor: 'pointer' },
                    })}
                    locale={{
                      emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No clients found" style={{ padding: '40px 0' }} />,
                    }}
                    style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}
                  />
                )}

                {/* ── Pagination Controls ── */}
                {pagination.totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 16 }}>
                    <Pagination
                      current={pagination.page}
                      total={pagination.total}
                      pageSize={pagination.limit}
                      onChange={(page) => setPagination(prev => ({ ...prev, page }))}
                      showSizeChanger={false}
                      showQuickJumper
                      responsive
                    />
                  </div>
                )}
              </>
            )}

            {/* ── Empty State ── */}
            {!loading && clients.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
                <Title level={4} style={{ color: '#1f2937', margin: '0 0 8px' }}>No clients found</Title>
                <Text style={{ color: '#9ca3af', fontSize: 14 }}>Try adjusting your search or filters.</Text>
                <div style={{ marginTop: 20 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => messageApi?.info?.('Add Client') || message.info('Add Client')}>
                    Add Your First Client
                  </Button>
                </div>
              </div>
            )}

            {/* ── Detail Modal ── */}
            <Modal
              open={isModalOpen && !!selectedClient}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedClient(null);
              }}
              footer={null}
              width={520}
              centered
              closable
              title={null}
              styles={{ body: { padding: 0 }, header: { display: 'none' } }}
            >
              {selectedClient && (
                <div>
                  <div style={{ height: 6, background: `linear-gradient(90deg, ${selectedClient.color}, ${selectedClient.color}88)`, borderRadius: '20px 20px 0 0' }} />
                  <div style={{ padding: '24px' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 20 }} align="start">
                      <Space>
                        <Avatar
                          size={56}
                          style={{
                            backgroundColor: `${selectedClient.color}18`,
                            border: `2px solid ${selectedClient.color}50`,
                            color: selectedClient.color,
                            fontWeight: 700,
                            fontSize: 20,
                          }}
                          src={selectedClient.avatar || undefined}
                        >
                          {!selectedClient.avatar && selectedClient.initials}
                        </Avatar>
                        <div>
                          <Title level={4} style={{ margin: 0, fontSize: 18 }}>
                            {selectedClient.firstName} {selectedClient.lastName}
                          </Title>
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            aka "{selectedClient.preferredName}"
                          </Text>
                        </div>
                      </Space>
                      <Button type="text" onClick={() => { setIsModalOpen(false); setSelectedClient(null); }} style={{ fontSize: 18 }}>×</Button>
                    </Space>

                    <Space wrap style={{ marginBottom: 20 }}>
                      {renderStatusTag(selectedClient.status)}
                      {selectedClient.isDraft && <Tag color="warning" style={{ fontWeight: 600, fontSize: 12 }}>📝 Draft</Tag>}
                    </Space>

                    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                      {[
                        { icon: <MailOutlined />, label: 'Email', val: selectedClient.email },
                        { icon: <PhoneOutlined />, label: 'Phone', val: selectedClient.phone },
                        { icon: <EnvironmentOutlined />, label: 'City', val: selectedClient.city },
                        { icon: <ClockCircleOutlined />, label: 'Frequency', val: selectedClient.frequency },
                        { icon: <CalendarOutlined />, label: 'Joined', val: selectedClient.joinedDate },
                        { icon: <CalendarOutlined />, label: 'Next Service', val: selectedClient.nextService },
                      ].map((row) => (
                        <Row key={row.label} align="middle" gutter={12}>
                          <Col style={{ fontSize: 16, color: '#9ca3af' }}>{row.icon}</Col>
                          <Col>
                            <Text style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>{row.label}</Text>
                            <Paragraph style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{row.val}</Paragraph>
                          </Col>
                        </Row>
                      ))}
                    </Space>

                    <Divider style={{ margin: '20px 0' }} />

                    <div style={{ marginBottom: 20 }}>
                      <Text style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Services</Text>
                      <div style={{ marginTop: 8 }}>{renderServiceTags(selectedClient.services)}</div>
                    </div>

                    <Space style={{ width: '100%' }}>
                      {selectedClient.isDraft ? (
                        <Button
                          type="primary"
                          block
                          size="large"
                          icon={<CheckCircleOutlined />}
                          style={{
                            background: 'linear-gradient(135deg, #E91E63, #f06292)',
                            borderColor: '#E91E63',
                            borderRadius: 10,
                            fontWeight: 600,
                          }}
                          onClick={() => handleCompleteRegistration(selectedClient)}
                        >
                          Complete Registration
                        </Button>
                      ) : (
                        <>
                          <Button block size="large" icon={<EditOutlined />} style={{ borderRadius: 10, fontWeight: 600 }} onClick={() => handleEdit(selectedClient)}>
                            Edit
                          </Button>
                          <Button
                            type="primary"
                            block
                            size="large"
                            icon={<CalendarOutlined />}
                            style={{
                              background: 'linear-gradient(135deg, #E91E63, #f06292)',
                              borderColor: '#E91E63',
                              borderRadius: 10,
                              fontWeight: 600,
                            }}
                            onClick={() => messageApi?.info?.('Book service for ' + selectedClient.firstName) || message.info('Book Service')}
                          >
                            Book Service
                          </Button>
                        </>
                      )}
                    </Space>
                  </div>
                </div>
              )}
            </Modal>

            {/* ── Delete Confirmation Modal ── */}
            <Modal
              title="Delete Client"
              open={isDeleteModalOpen}
              onCancel={() => {
                setIsDeleteModalOpen(false);
                setClientToDelete(null);
              }}
              footer={[
                <Button key="cancel" onClick={() => { setIsDeleteModalOpen(false); setClientToDelete(null); }}>
                  Cancel
                </Button>,
                <Button
                  key="delete"
                  type="primary"
                  danger
                  onClick={() => clientToDelete && handleDelete(clientToDelete)}
                >
                  Delete
                </Button>,
              ]}
            >
              <Paragraph>
                Are you sure you want to delete <strong>{clientToDelete?.firstName} {clientToDelete?.lastName}</strong>? 
                This action cannot be undone.
              </Paragraph>
            </Modal>
          </div>
        </div>
      </ConfigProvider>
    </App>
  );
};

export default ClientList;